using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
    public class ImageService
    {
        private readonly IConfiguration _config;
        private readonly Cloudinary _cloudinary;
        public ImageService(IConfiguration config)
        {
            _config = config;
            var cloudinaryConfig = _config.GetSection("Cloudinary");
            var acc = new Account
            (
                cloudinaryConfig["CloudName"],
                cloudinaryConfig["ApiKey"],
                cloudinaryConfig["ApiSecret"]
            );
            _cloudinary = new Cloudinary(acc);
        }

        public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream)
                    };
                    uploadResult = await _cloudinary.UploadAsync(uploadParams);
                }
            }
            return uploadResult;
        }
        public async Task<DeletionResult> DeleteImageAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result;
        }

    }
}