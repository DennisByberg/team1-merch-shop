// filepath: MerchStoreDemo/infra/ReviewApiFunction/SwaggerConfiguration.cs
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.OpenApi.Models;

namespace ReviewApiFunction
{
    public class SwaggerConfiguration : IOpenApiConfigurationOptions
    {
        public OpenApiInfo Info { get; set; } = new OpenApiInfo()
        {
            Version = "1.0.2",
            Title = "EchoCraft Product Reviews API",
            Description = "API for product reviews in the EchoCraft application",
            Contact = new OpenApiContact()
            {
                Name = "EchoCraft Team"
            }
        };

        public List<OpenApiServer> Servers { get; set; } = [];
        public OpenApiVersionType OpenApiVersion { get; set; } = OpenApiVersionType.V3;
        public bool IncludeRequestingHostName { get; set; } = true;
        public bool ForceHttps { get; set; } = false;
        public bool ForceHttp { get; set; } = false;
        // Add the filter here
        public List<IDocumentFilter> DocumentFilters { get; set; } =
        [
            new ApiKeyAuthDocumentFilter()
        ];
    }

    public class SwaggerUIConfiguration : IOpenApiCustomUIOptions
    {
        public string? CustomStylesheetPath { get; set; }
        public string? CustomJavaScriptPath { get; set; }

        public Task<string?> GetJavaScriptAsync()
        {
            return Task.FromResult<string?>(null);
        }

        public Task<string?> GetStylesheetAsync()
        {
            return Task.FromResult<string?>(null);
        }
    }
}