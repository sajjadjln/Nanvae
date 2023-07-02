using System;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Extensions;
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
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null)
            {
                return NotFound();
            }

            return basket.MapBasketToDto();
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(X => X.BuyerId == buyerId);
        }
        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) basket = CreateBasket();
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return BadRequest(new ProblemDetails() { Title = "Product not found" });
            }

            basket.AddItem(product, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());
            //if(result) return StatusCode(201);
            return BadRequest(new ProblemDetails() { Title = "Problem adding item to basket" });
            // in order to cookie be allowed in http i changed the"applicationUrl": "http://localhost:5002;https://localhost:5000", in the appSettings.development.json
            // and  "applicationUrl": "http://localhost:5002;https://localhost:5000" in the launchSettings.json
            //and change the axios.defaults.baseURL = 'http://localhost:5002/api/'; in agent
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions()
                {
                    Secure = false,
                    IsEssential = true,
                    Expires = DateTime.Now.AddDays(30)
                };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket;
        }


        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) return NotFound();
            basket.RemoveItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();
            return BadRequest(new ProblemDetails() { Title = "Problem removing item from basket" });
        }
    }
}