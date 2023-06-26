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
            var products =  PagedList<ProductToReturnDto>.ToPagedList(productsToReturn.AsQueryable(),
                productParams.PageNumber, productParams.PageSize);
            Response.AddPaginationHeader(products.MetaData);
            return Ok(products);
        }

        [HttpGet("{id}")]
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
            return Ok(new {brands,types});
        }
    }
}