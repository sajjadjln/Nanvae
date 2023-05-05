using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _repo;

        public ProductController(IProductRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IReadOnlyList<Product>> GetProducts()
        {
            return await _repo.GetProductsAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            return await _repo.GetProductByIdAsync(id);
        }
        [HttpGet("brands")]
        public async Task<IReadOnlyList<ProductBrands>> GetProductBrands()
        {
            return await _repo.GetProductsBrandsAsync();
        }
        [HttpGet("types")]
        public async Task<IReadOnlyList<ProductTypes>> GetProductTypes()
        {
            return await _repo.GetProductTypesAsync();
        }

    }
}