using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specification
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification()
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand); //we are going to include the product type and product brand
        }

        public ProductsWithTypesAndBrandsSpecification(int id) : base(x => x.Id == id) //we are going to add a criteria to our base specification
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }

    }
}