using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Repository
{
    public interface IProductRepository
    {
        Task<List<Product>> GetProducts();
        Task<Product> GetProductById(int id);
    }
}