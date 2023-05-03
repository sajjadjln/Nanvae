using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Infrastructure.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ProductContext context)
        {
            context.Database.EnsureCreated();

            // Look for any products.
            if (context.Products.Any())
            {
                return;   // DB has been seeded
            }

            var products = new List<Product>
            {
            new Product
            {
                Name = "Product 1",
                Description = "Description 1",
                Type = "Type 1",
                Brand = "Brand 1",
                Price = "Price 1",
                PictureUrl = "PictureUrl 1"
            },
            new Product
            {
                Name = "Product 2",
                Description = "Description 2",
                Type = "Type 2",
                Brand = "Brand 2",
                Price = "Price 2",
                PictureUrl = "PictureUrl 2"
            },
            new Product
            {
                Name = "Product 3",
                Description = "Description 3",
                Type = "Type 3",
                Brand = "Brand 3",
                Price = "Price 3",
                PictureUrl = "PictureUrl 3"
            },
            new Product
            {
                Name = "Product 4",
                Description = "Description 4",
                Type = "Type 4",
                Brand = "Brand 4",
                Price = "Price 4",
                PictureUrl = "PictureUrl 4"
            },
            new Product
            {
                Name = "Product 5",
                Description = "Description 5",
                Type = "Type 5",
                Brand = "Brand 5",
                Price = "Price 5",
                PictureUrl = "PictureUrl 5"
            },
            new Product
            {
                Name = "Product 6",
                Description = "Description 6",
                Type = "Type 6",
                Brand = "Brand 6",
                Price = "Price 6",
                PictureUrl = "PictureUrl 6"
            },
            new Product
            {
                Name = "Product 7",
                Description = "Description 7",
                Type = "Type 7",
                Brand = "Brand 7",
                Price = "Price 7",
                PictureUrl = "PictureUrl 7"
            },
            };

            foreach (Product p in products)
            {
                context.Products.Add(p);
            }
            context.SaveChanges();
        }
    }
}