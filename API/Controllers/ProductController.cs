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
using API.Services;

namespace API.Controllers
{
    public class ProductController : BaseController
    {
        private readonly ProductContext _context;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        public ProductController(ProductContext context, IProductRepository productRepository, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
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
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            if (productDto.File != null)
            {
                var uploadResult = await _imageService.AddImageAsync(productDto.File);
                if (uploadResult.Error != null) return BadRequest(
                    new ProblemDetails { Title = "Error", Detail = uploadResult.Error.Message });
                product.PictureUrl = uploadResult.SecureUrl.ToString();
                product.publicId = uploadResult.PublicId;
            }
            _context.Products.Add(product);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            return BadRequest(new ProblemDetails { Title = "Error", Detail = "Error while creating product" });
        }
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm]UpdateProductDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);

            if (product == null) return NotFound();

            _mapper.Map(productDto, product);

            if (productDto.File != null)
            {
                var imageUploadResult = await _imageService.AddImageAsync(productDto.File);

                if (imageUploadResult.Error != null) 
                    return BadRequest(new ProblemDetails { Title = imageUploadResult.Error.Message });

                if (!string.IsNullOrEmpty(product.publicId)) 
                    await _imageService.DeleteImageAsync(product.publicId);

                product.PictureUrl = imageUploadResult.SecureUrl.ToString();
                product.publicId = imageUploadResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(product);

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.publicId))
                await _imageService.DeleteImageAsync(product.publicId);

            _context.Products.Remove(product);
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();
            return BadRequest(new ProblemDetails { Title = "problem deleting product" });
        }
    }
}