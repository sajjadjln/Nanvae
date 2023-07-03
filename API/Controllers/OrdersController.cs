using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Extensions;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseController
    {
        private readonly ProductContext _context;

        public OrdersController(ProductContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }
        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context.Baskets
                .RetriveBasketWithItems(User.Identity?.Name)
                .FirstOrDefaultAsync();
            if (basket == null)
            {
                return BadRequest(new ProblemDetails { Title = "could not locate the basket" });
            }

            var items = new List<OrderItems>();
            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrder
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                var orderItem = new OrderItems
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity

                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subtotal > 1000 ? 0 : 10;

            var order = new Order
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                SubTotal = subtotal,
                DeliveryFee = deliveryFee
            };
            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);
            if (orderDto.SaveAddress)
            {
                var user = await _context.Users
                    .Include(u => u.Address) // Include the Address entity
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                if (user.Address == null)
                {
                    user.Address = new UserAddress
                    {
                        FullName = orderDto.ShippingAddress.FullName,
                        Address1 = orderDto.ShippingAddress.Address1,
                        Address2 = orderDto.ShippingAddress.Address2,
                        City = orderDto.ShippingAddress.City,
                        State = orderDto.ShippingAddress.State,
                        Zip = orderDto.ShippingAddress.Zip,
                        Country = orderDto.ShippingAddress.Country
                    };
                }
                else
                {
                    // Update existing address
                    user.Address.FullName = orderDto.ShippingAddress.FullName;
                    user.Address.Address1 = orderDto.ShippingAddress.Address1;
                    user.Address.Address2 = orderDto.ShippingAddress.Address2;
                    user.Address.City = orderDto.ShippingAddress.City;
                    user.Address.State = orderDto.ShippingAddress.State;
                    user.Address.Zip = orderDto.ShippingAddress.Zip;
                    user.Address.Country = orderDto.ShippingAddress.Country;
                }

                _context.Update(user);
            }
            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
            }

            return BadRequest("problem creating order");
        }
    }
}