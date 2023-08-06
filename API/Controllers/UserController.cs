using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Services;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly ProductContext _context;

        public UserController(UserManager<User> userManager, TokenService tokenService, ProductContext context)
        {
            _context = context;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<PanelUserDto>>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = users.Select(u => new PanelUserDto()
            {
                Email = u.Email,
                UserName = u.UserName,
                Id = u.Id
            }).ToList();

            return userDtos;
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<PanelUserDto>> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var userDto = new PanelUserDto()
            {
                Email = user.Email,
                UserName = user.UserName,
                Id = user.Id
            };

            return userDto;
        }

        [HttpPost("users")]
        public async Task<ActionResult<PanelUserDto>> CreateUser(RegisterDto registerDto)
        {
            var user = new User
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

            var userDto = new PanelUserDto()
            {
                Email = user.Email,
                UserName = user.UserName,
            };

            return userDto;
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(string id, PanelUserDto userDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();
            
            user.Email = userDto.Email;
            user.UserName = userDto.UserName;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            return Ok();
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            return Ok();
        }
        
    }
}
