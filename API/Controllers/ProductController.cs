using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specification;
using AutoMapper;
using API.Dtos;
using API.Errors;
using Microsoft.AspNetCore.Http;

namespace API.Controllers
{


    public class ProductController : BaseController
    {

        private readonly IGenericRepository<Product> _repo;
        private readonly IGenericRepository<ProductTypes> _repoType;
        private readonly IGenericRepository<ProductBrands> _repoBrand;
        private readonly IMapper _mapper;

        public ProductController(IGenericRepository<Product> repo,
            IGenericRepository<ProductBrands> repoBrand, IGenericRepository<ProductTypes> repoType,
            IMapper mapper)
        {
            _mapper = mapper;
            _repoBrand = repoBrand;
            _repoType = repoType;
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts()
        {
            var spec = new ProductsWithTypesAndBrandsSpecification();
            var products = await _repo.ListAsync(spec);
            return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
        }
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse),StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProductById(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _repo.GetEntityWithSpec(spec);
            if (product == null)
            {
                return NotFound(new ApiResponse(404));
            }
            return _mapper.Map<Product, ProductToReturnDto>(product);
        }
        [HttpGet("brands")]
        public async Task<IReadOnlyList<ProductBrands>> GetProductBrands()
        {
            return await _repoBrand.ListAllAsync();
        }
        [HttpGet("types")]
        public async Task<IReadOnlyList<ProductTypes>> GetProductTypes()
        {
            return await _repoType.ListAllAsync();
        }

    }
}