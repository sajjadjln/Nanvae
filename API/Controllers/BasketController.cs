using System;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseController
    {
        private readonly ProductContext _context;

        public BasketController(ProductContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();
            if (basket == null)
            {
                return NotFound();
            }

            return MapBasketDto(basket);
        }

        private BasketDto MapBasketDto(Basket basket)
        {
            return new BasketDto()
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    productId = item.ProductId, // Update property name to ProductId
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Quantity = item.Quantity,
                    ProductBrand = item.Product.ProductBrand,
                    ProductType = item.Product.ProductType
                }).ToList()
            };
        }


        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(X => X.BuyerId == Request.Cookies["buyerId"]);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) basket = CreateBasket();
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return BadRequest(new ProblemDetails() { Title = "Product not found" });
            }

            basket.AddItem(product, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetBasket", MapBasketDto(basket));
            //if(result) return StatusCode(201);
            return BadRequest(new ProblemDetails() { Title = "Problem adding item to basket" });
            // in order to cookie be allowed in http i changed the"applicationUrl": "http://localhost:5002;https://localhost:5000", in the appSettings.development.json
            // and  "applicationUrl": "http://localhost:5002;https://localhost:5000" in the launchSettings.json
            //and change the axios.defaults.baseURL = 'http://localhost:5002/api/'; in agent
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions()
            {
                Secure = false,
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket;
        }


        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            basket.RemoveItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();
            return BadRequest(new ProblemDetails() { Title = "Problem removing item from basket" });
        }
    }
}