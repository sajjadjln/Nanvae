using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API.Dtos
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string ProductType { get; set; }
        [Required]
        public string ProductBrand { get; set; }
        [Required]
        [Range(0.10, double.PositiveInfinity)]
        public Decimal Price { get; set; }
        [Required]
        public IFormFile File { get; set; }
        [Required]
        [Range(0, 200)]
        public int QuantityInStock { get; set; }
    }
}