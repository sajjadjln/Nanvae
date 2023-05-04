using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ProductTypes ProductType { get; set; }
        public int ProductTypeId {get; set;}
        public ProductBrands ProductBrand { get; set; }
        public int ProductBrandId {get; set;}
        public Decimal Price { get; set; }
        public string PictureUrl { get; set; }
    }
}