using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ProductContext : IdentityDbContext<User>
    {
        public ProductContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var memberRole = new IdentityRole { Name = "Member", NormalizedName = "MEMBER" };
            var adminRole = new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" };

            builder.Entity<IdentityRole>().HasData(memberRole, adminRole);
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

    }
}