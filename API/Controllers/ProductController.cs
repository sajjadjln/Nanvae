using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using AutoMapper;
using System.Text.Json;
using API.RequestHelpers;
using API.Dtos;
using API.Errors;
using API.Extensions;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography.X509Certificates;

namespace API.Controllers
{
    public class ProductController : BaseController
    {
        private readonly ProductContext _context;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductController(ProductContext context, IProductRepository productRepository, IMapper mapper)
        {
            _context = context;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts(
           [FromQuery] ProductParams productParams)
        {
            var query = await _productRepository.GetProductsAsync(
                productParams.OrderBy, productParams.SearchTerm, productParams.Brands, productParams.Types);

            var productsToReturn = _mapper.Map<
                IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(query.ToList());
            var products = PagedList<ProductToReturnDto>.ToPagedList(productsToReturn.AsQueryable(),
                productParams.PageNumber, productParams.PageSize);
            Response.AddPaginationHeader(products.MetaData);
            return Ok(products);
        }

        [HttpGet("{id}", Name = "GetProduct")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new ApiResponse(404));
            }

            return _mapper.Map<Product, ProductToReturnDto>(product);
        }
        [HttpGet("filters")]
        public async Task<ActionResult<Dictionary<string, List<string>>>> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.ProductBrand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.ProductType).Distinct().ToListAsync();
            return Ok(new { brands, types });
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            _context.Products.Add(product);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            return BadRequest(new ProblemDetails { Title = "Error", Detail = "Error while creating product" });
        }
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct(UpdateProductDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);
            if (product == null) return NotFound();

            _mapper.Map(productDto,product);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return NoContent();
            return BadRequest(new ProblemDetails{Title="problem updating product"});
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            _context.Products.Remove(product);
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();
            return BadRequest(new ProblemDetails{Title="problem deleting product"});
        }
    }
}