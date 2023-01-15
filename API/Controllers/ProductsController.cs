using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("API/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IGenericRepository<Product> productsRepository;
        public IGenericRepository<ProductBrand> productBrandRepository;
        private readonly IGenericRepository<ProductType> productTypeRepository;
        public IMapper mapper { get; }

        public ProductsController(IGenericRepository<Product> productsRepository, IGenericRepository<ProductBrand> productBrandRepository,
        IGenericRepository<ProductType> productTypeRepository, IMapper mapper)
        {
            this.productBrandRepository = productBrandRepository;
            this.productTypeRepository = productTypeRepository;
            this.productsRepository = productsRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts()
        {
            var products = await productsRepository.ListAsync(new ProductsWithTypesAndBrandsSpecification());
            return Ok(mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var specification = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await productsRepository.GetEntityWithSpec(specification);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(mapper.Map<Product, ProductToReturnDto>(product));
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await productBrandRepository.listAllAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductTypes()
        {
            return Ok(await productTypeRepository.listAllAsync());
        }
    }
}