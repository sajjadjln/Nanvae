using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class BuggyController : BaseController
    {
        private readonly ProductContext _context;
        public BuggyController(ProductContext context)
        {
            _context = context;
        }

        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            return NotFound(new ApiResponse(404));
        }
        [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            var thing = _context.Products.Find(42);
            var thingToReturn = thing.ToString();
            return Ok();
        }
        [HttpGet("badrequest")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400));
        }
        [HttpPost("badrequest/{id}")]
        public ActionResult GetNotFoundRequest(int id)
        {
            return Ok(); // passing string instead of int
        }
        [HttpGet("auth")]
        public ActionResult<string> GetUnauthorize()
        {
            return Unauthorized(new ApiResponse(401));
        }
        [HttpPost("validation-error")]
        public ActionResult<string> GetValidationError()
        {
            ModelState.AddModelError("Name", "Name is required");
            ModelState.AddModelError("Email", "Email is required");
            return ValidationProblem();
        }
    }
}