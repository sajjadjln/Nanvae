using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public List<OrderItems> OrderItems { get; set; }
        public decimal SubTotal { get; set; }
        public decimal DeliveryFee  { get; set; }
        public OrderStatus orderStatus  { get; set; } = OrderStatus.Pending;

        public decimal GetTotal()
        {
            return SubTotal + DeliveryFee;
        }
    }
}