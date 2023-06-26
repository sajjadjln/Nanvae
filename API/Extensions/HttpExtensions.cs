using System.Text.Json;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response,MetaData metaData)
        {
            // Create a new instance of PaginationHeader
            //var paginationHeader = new PaginationHeader(metaData);
            // Create a new instance of JsonSerializerOptions
            var options = new JsonSerializerOptions
            {
                // Set PropertyNamingPolicy to camelCase
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            // Add a new header to the response
            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData,options));
            // Allow any origin to access the header
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
        
    }
}