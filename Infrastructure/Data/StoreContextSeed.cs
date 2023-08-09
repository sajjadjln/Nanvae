using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using System.IO;
using System.Reflection;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(ProductContext context,ILoggerFactory loggerFactory, UserManager<User> userManager)
        {
            try
            {
                var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                if (!userManager.Users.Any())
                {
                    var user = new User()
                    {
                        UserName = "Bob",
                        Email = "bob@user.com"
                    };
                    await userManager.CreateAsync(user,"Pa$$w0rd");
                    await userManager.AddToRoleAsync(user, "Member");

                    var admin = new User()
                    {
                        UserName = "admin",
                        Email = "admin@user.com"
                    };
                    var owner = new User()
                    {
                        UserName = "owner",
                        Email = "owner@user.com"
                    };
                    await userManager.CreateAsync(admin,"Pa$$w0rd");
                    await userManager.CreateAsync(owner,"Pa$$w0rd");
                    await userManager.AddToRolesAsync(admin, new[]{"Member","Admin"});
                    await userManager.AddToRolesAsync(owner, new[]{"Member","Admin","Owner"});
                }
                if (!context.Products.Any())
                {
                    var productsData = await System.IO.File.ReadAllTextAsync(path + @"/Data/SeedData/products.json");
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                    foreach (var item in products)
                    {
                        context.Products.Add(item);
                    }
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex,"An error occurred during migration");
            }
        }
    }
}