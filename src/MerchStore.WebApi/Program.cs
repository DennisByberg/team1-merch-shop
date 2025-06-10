using System.Reflection;
using MerchStore.Application;
using MerchStore.Infrastructure;
using MerchStore.WebApi.Authentication.ApiKey;
using Microsoft.OpenApi.Models;
using Azure.Identity;
using MerchStore.Infrastructure.ExternalServices;
using MerchStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Key Vault
var keyVaultUri = new Uri("https://merchstorekeyvault.vault.azure.net/");
builder.Configuration.AddAzureKeyVault(keyVaultUri, new DefaultAzureCredential());

// Configure database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.MigrationsAssembly("MerchStore.Infrastructure")
    ));

// Add support for controllers (API endpoints)
builder.Services.AddControllers();

// Add cookie authentication services
builder.Services.AddControllersWithViews();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie();

// Add API key authentication
var apiKeyValue = builder.Configuration["ApiKey:Value"];
if (string.IsNullOrEmpty(apiKeyValue))
{
    throw new InvalidOperationException("API Key is not configured in appsettings.json or Key Vault.");
}

builder.Services.AddAuthentication()
   .AddApiKey(apiKeyValue);

// Add API key authorization policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ApiKeyPolicy", policy =>
        policy.AddAuthenticationSchemes(ApiKeyAuthenticationDefaults.AuthenticationScheme)
              .RequireAuthenticatedUser());
});

// Configure Kestrel server - Only HTTP for development to avoid CORS issues
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    if (builder.Environment.IsDevelopment())
    {
        // Check if we're running in Docker
        bool isRunningInDocker = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER"));

        if (isRunningInDocker)
        {
            serverOptions.ListenAnyIP(8080);
        }
        else
        {
            // Only HTTP for development to simplify CORS
            serverOptions.ListenAnyIP(5000);
        }
    }
    else
    {
        // Production
        var portEnvVar = Environment.GetEnvironmentVariable("PORT");
        if (!string.IsNullOrEmpty(portEnvVar) && int.TryParse(portEnvVar, out int port))
        {
            serverOptions.ListenAnyIP(port);
        }
        else
        {
            serverOptions.ListenAnyIP(8080);
        }
    }
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register application and infrastructure services
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Add Swagger/OpenAPI
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

// Configure OpenIddict
builder.Services.AddOpenIddict()
    .AddValidation(options =>
    {
        options.UseLocalServer();
        options.UseAspNetCore();
    })
    .AddServer(options =>
    {
        options.SetTokenEndpointUris("/connect/token")
            .SetAuthorizationEndpointUris("/connect/authorize");

        options.AllowAuthorizationCodeFlow();

        options.AddDevelopmentEncryptionCertificate()
            .AddDevelopmentSigningCertificate();

        options.UseAspNetCore()
            .EnableTokenEndpointPassthrough()
            .EnableAuthorizationEndpointPassthrough();

        if (builder.Environment.IsDevelopment())
        {
            options.UseAspNetCore().DisableTransportSecurityRequirement();
        }
    });

// Build the application
var app = builder.Build();

// Configure Forwarded Headers Middleware
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};
forwardedHeadersOptions.KnownNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();

app.UseForwardedHeaders(forwardedHeadersOptions);
app.UseCors();

// Configure middleware pipeline
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "MerchStore API V1");
});

// No HTTPS redirection in development to simplify CORS
if (!builder.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Authentication and Authorization come AFTER CORS
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Redirect root URL to Swagger UI
app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

// Database initialization
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    try
    {
        if (app.Environment.IsDevelopment())
        {
            Console.WriteLine("Development environment detected: Applying migrations...");
            await db.Database.MigrateAsync();

            // Seed only if database is empty
            if (!await db.Products.AnyAsync())
            {
                Console.WriteLine("Database is empty, seeding data...");
                await app.Services.SeedDatabaseAsync();
            }
            else
            {
                Console.WriteLine("Database already contains data, skipping seed.");
            }

            Console.WriteLine("Database setup completed successfully.");
        }
        else
        {
            Console.WriteLine("Production environment detected: Applying migrations...");
            await db.Database.MigrateAsync();
            Console.WriteLine("Migrations applied successfully.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error setting up database: {ex.Message}");
        throw;
    }
}

// Configure OpenIddict providers
new LoginService(app.Services).StartAsync(default).Wait();

// Run the application
app.Run();