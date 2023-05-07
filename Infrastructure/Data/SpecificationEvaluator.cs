using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery,
            ISpecification<TEntity> spec) //inputQuery is the query we are going to build up
        {
            var query = inputQuery;

            if(spec.Criteria != null) //if there is a criteria
            {
                query = query.Where(spec.Criteria); //we are going to apply the criteria to the query // p => p.productTypeId == id
            }

            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include)); //we are going to apply the includes to the query

            return query;
        }
    }
}