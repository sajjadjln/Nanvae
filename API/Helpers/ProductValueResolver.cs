using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class ProductValueResolver : IValueResolver<Product, ProductToReturnDto, string> //map from , map to, type of destination member
    {
        private readonly IConfiguration _config;

        public ProductValueResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Product source, ProductToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.PictureUrl))
            {
                return source.PictureUrl;
            }
            return null;
            //return _config["ApiUrl"] + source.PictureUrl;
        }
    }
}