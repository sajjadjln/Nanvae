using System;

namespace API.Dtos
{
    public class BasketItemDto
    {
        public int productId { get; set; }
        public string Name { get; set; }
        public Decimal Price { get; set; }
        public string PictureUrl { get; set; }
        public string ProductBrand { get; set; }
        public string ProductType { get; set; }
        public int Quantity { get; set; } 
    }
}