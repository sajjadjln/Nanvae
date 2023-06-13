using System.Collections.Generic;
using System.Linq;

namespace Core.Entities
{
    public class Basket : BaseEntity
    {
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();    

        public void AddItem(Product product,int quantity)
        {
           if(Items.All(item => item.ProductId != product.Id))
           {
               Items.Add(new BasketItem { ProductId = product.Id, Quantity = quantity });
           }
           var existingItem = Items.FirstOrDefault(x => x.ProductId == product.Id);
           if( existingItem != null)
           {
               existingItem.Quantity += quantity;
           }
        }
        public void RemoveItem(int productId,int quantity)
        {
            var item = Items.FirstOrDefault(x => x.ProductId == productId);
            if(item == null) return;
            item.Quantity -= quantity;
            if(item.Quantity <= 0)
            {
                Items.Remove(item);
            }
        }
    }
}