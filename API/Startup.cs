using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using API.Helpers;
using API.Middleware;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text;
using API.Errors;
using API.Services;
using Core.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddDbContext<ProductContext>(options =>
            // {
            //     options.UseNpgsql(_config.GetConnectionString("DefaultConnection"));
            // });
            services.AddDbContext<ProductContext>(options =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connStr;

                // Depending on if in development or production, use either Heroku-provided
                // connection string, or development connection string from env var.
                if (env == "Development")
                {
                    // Use connection string from file.
                    connStr = _config.GetConnectionString("DefaultConnection");
                }
                else
                {
                    //   Use connection string provided at runtime by Heroku.
                    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                    // Parse connection URL to connection string for Npgsql
                    /* connUrl = connUrl.Replace("postgres://", string.Empty);
                     var pgUserPass = connUrl.Split("@")[0];
                     var pgHostPortDb = connUrl.Split("@")[1];
                     var pgHostPort = pgHostPortDb.Split("/")[0];
                     var pgDb = pgHostPortDb.Split("/")[1];
                     var pgUser = pgUserPass.Split(":")[0];
                     var pgPass = pgUserPass.Split(":")[1];
                     var pgHost = pgHostPort.Split(":")[0];
                     var pgPort = pgHostPort.Split(":")[1];*/

                    // connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass}; Database={pgDb}";
                    connStr = $"Server=store-pr; Port=5432; User Id=root; Password=1j5ZIzdo0J2qM8ZiF12taNt8; Database=store-pr";
                }
                options.UseNpgsql(connStr);
                // Whether the connection string came from the local development configuration file
                // or from the environment variable from Heroku, use it to set up your DbContext.
                //options.UseNpgsql(connStr);
            });

            services.AddControllers();
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddApplicationServices();
            services.AddSwaggerDocumentation();
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            services.AddCors();
            services.AddIdentityCore<User>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
            })
                .AddRoles<Role>()
                .AddEntityFrameworkStores<ProductContext>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    string tokenKey = _config["TokenKey"]; // Retrieve the configuration value

                    if (string.IsNullOrEmpty(tokenKey))
                    {
                        throw new InvalidOperationException("JWT TokenKey configuration value is null or empty.");
                    }

                    // Use the tokenKey in the configuration
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
                        // IssuerSigningKey =
                        //     new SymmetricSecurityKey(Encoding.UTF8
                        //         .GetBytes(_config["JWTSettings:TokenKey"])),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true
                    };
                });

            services.AddAuthorization();
            services.AddScoped<TokenService>();
            services.AddScoped<ImageService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseStatusCodePagesWithReExecute("/errors/{0}"); // 0 is the place holder for the status code
            //app.UseHttpsRedirection();

            app.UseRouting();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://nanvae.iran.liara.run", "http://localhost:3000"));

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseSwaggerDocumentation();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
            //          app.UseMiddleware<NotFoundMiddleware>();
        }
    }
}
