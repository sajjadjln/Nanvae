using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ProductType { get; set; }
        public string ProductBrand { get; set; }
        public Decimal Price { get; set; }
        public string PictureUrl { get; set; }
        public int QuantityInStock { get; set; }
        public string publicId { get; set; }
    }
}