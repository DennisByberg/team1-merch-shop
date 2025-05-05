using System.Reflection;
using System.Text.Json.Serialization;
using MerchStore.Application;
using MerchStore.Infrastructure;
using MerchStore.WebApi.Authentication.ApiKey;
using Microsoft.OpenApi.Models;
using Azure.Identity;
using MerchStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

// Create and configure the WebApplication for MerchStore API
var builder = WebApplication.CreateBuilder(args);

var keyVaultUri = new Uri("https://merchstorekeyvault.vault.azure.net/");
builder.Configuration.AddAzureKeyVault(keyVaultUri, new DefaultAzureCredential());

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add support for controllers (API endpoints)
builder.Services.AddControllers();

// Add API key authentication
builder.Services.AddAuthentication()
   .AddApiKey(builder.Configuration["ApiKey:Value"] ?? throw new InvalidOperationException("API Key is not configured in the application settings."));

// Add API key authorization policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ApiKeyPolicy", policy =>
        policy.AddAuthenticationSchemes(ApiKeyAuthenticationDefaults.AuthenticationScheme)
              .RequireAuthenticatedUser());
});

// Configure CORS policy to allow any origin, header, and method
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

// Register application services (e.g. services, interfaces)
builder.Services.AddApplication();

// Register infrastructure services (e.g. DbContext, repositories)
builder.Services.AddInfrastructure(builder.Configuration);

// Add Swagger/OpenAPI for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MerchStore API",
        Version = "v1",
        Description = "API for MerchStore product catalog",
        Contact = new OpenApiContact
        {
            Name = "MerchStore Support",
            Email = "support@merchstore.example.com"
        }
    });

    options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Description = "API Key required in the X-API-Key header",
        Type = SecuritySchemeType.ApiKey,
        Name = "X-API-Key",
        In = ParameterLocation.Header,
        Scheme = "ApiKeyScheme"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                }
            },
            Array.Empty<string>()
        }
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

// Build the application pipeline
var app = builder.Build();

// Configure the HTTP request pipeline for the application
if (app.Environment.IsDevelopment())
{
    // Seed the database with initial data in development mode
    app.Services.SeedDatabaseAsync().Wait();
}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "MerchStore API V1");
});

app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS
app.UseCors("AllowAllOrigins"); // Enable CORS policy
app.UseAuthentication(); // Enable authentication middleware
app.UseAuthorization(); // Enable authentication and authorization middleware
app.MapControllers(); // Map API controllers

// Redirect root URL to Swagger UI
app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

// Run the application
app.Run();