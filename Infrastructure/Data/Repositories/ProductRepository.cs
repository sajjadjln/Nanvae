using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ProductContext _context;

        public ProductRepository(ProductContext context)
        {
            _context = context;
        }
        public async Task<IQueryable<Product>> GetProductsAsync(string orderBy, string searchTerm, string brands, string types)
        {
            var brandsList = new List<string>();
            var typesList = new List<string>();

            if (!string.IsNullOrWhiteSpace(brands))
            {
                brandsList = brands.ToLower().Split(',').ToList();
            }

            if (!string.IsNullOrWhiteSpace(types))
            {
                typesList = types.ToLower().Split(',').ToList();
            }

            var query = _context.Products.AsQueryable();
            query = query.Where(p => brandsList.Count == 0 || brandsList.Contains(p.ProductBrand.ToLower()));
            query = query.Where(p => typesList.Count == 0 || typesList.Contains(p.ProductType.ToLower()));

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerCaseSearchTerm = searchTerm.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
            }

            var products = await query.ToListAsync();

            switch (orderBy)
            {
                case "price":
                    products = products.OrderBy(p => p.Price).ToList();
                    break;
                case "priceDesc":
                    products = products.OrderByDescending(p => p.Price).ToList();
                    break;
                default:
                    products = products.OrderBy(p => p.Name).ToList();
                    break;
            }

            return products.AsQueryable();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _context.Products
               .SingleOrDefaultAsync(p => p.Id == id);
        }

    }
}