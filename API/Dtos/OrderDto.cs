using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public List<OrderItemDto> OrderItems { get; set; }
        public decimal SubTotal { get; set; }
        public decimal DeliveryFee  { get; set; }
        public string OrderStatus  { get; set; }
        public decimal Total { get; set; }

        public decimal GetTotal()
        {
            return SubTotal + DeliveryFee;
        }
    }
}