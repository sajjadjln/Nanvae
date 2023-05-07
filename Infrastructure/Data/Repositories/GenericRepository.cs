using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly ProductContext _context;
        public GenericRepository(ProductContext context)
        {
            _context = context;
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<T> GetEntityWithSpec(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).FirstOrDefaultAsync(); //we are going to return the first entity that matches the specification
        }

        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).ToListAsync(); //we are going to return a list of entities that match the specification
        }
        private IQueryable<T> ApplySpecification(ISpecification<T> spec) //this method will return a queryable
        {
            return SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(), spec); //we are going to return the queryable
        }
    }
}