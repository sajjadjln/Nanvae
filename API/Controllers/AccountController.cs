using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Extensions;
using API.Services;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly ProductContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, ProductContext context)
        {
            _context = context;
            _userManager = userManager;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user == null) return Unauthorized();
            var userBasket = await RetrieveBasket(loginDto.UserName);
            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
            if(anonBasket != null)
            {
                if(userBasket != null) _context.Baskets.Remove(userBasket);
                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }
            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (result)
            {
                return new UserDto
                {
                    Token = await _tokenService.CreateToken(user),
                    Email = user.Email,
                    Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
                };
            }
            return Unauthorized();
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User()
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");
            return StatusCode(201);
        }
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity?.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name);
            return new UserDto
            {
                Token = await _tokenService.CreateToken(user),
                Email = user.Email,
                Basket = userBasket?.MapBasketToDto()
            };
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
    }
}