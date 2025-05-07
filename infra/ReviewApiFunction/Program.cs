using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using ReviewApiFunction;
using Microsoft.Extensions.DependencyInjection; // Make sure to include your namespace

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

// Add OpenAPI configuration using our custom classes
builder.Services.AddSingleton<IOpenApiConfigurationOptions, SwaggerConfiguration>();

// Add custom UI options
builder.Services.AddSingleton<IOpenApiCustomUIOptions, SwaggerUIConfiguration>();

// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

builder.Build().Run();