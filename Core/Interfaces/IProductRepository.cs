using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IProductRepository
    {
        Task<IQueryable<Product>> GetProductsAsync(string orderBy,string searchTerm,string brands,string types);
        Task<Product> GetProductByIdAsync(int id);
    }
}