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

// Lägg endast till Azure Key Vault-konfiguration om applikationen körs i produktionsmiljö.
if (builder.Environment.IsProduction())
{
    var keyVaultUri = new Uri("https://merchstorekeyvault.vault.azure.net/");
    builder.Configuration.AddAzureKeyVault(keyVaultUri, new DefaultAzureCredential());
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connString = builder.Configuration["DefaultMerchStoreDB"];
    if (string.IsNullOrWhiteSpace(connString))
    {
        throw new InvalidOperationException("Missing DefaultMerchStoreDB secret in configuration.");
    }

    options.UseSqlServer(connString + ";Connection Timeout=60;");
});

// Add support for controllers (API endpoints)
builder.Services.AddControllers();

// Add cookie authentication services
builder.Services.AddControllersWithViews();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie();

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

// configure https localhost
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    if (builder.Environment.IsDevelopment())
    {
        // Check if we're running in Docker (simple environment variable check)
        bool isRunningInDocker = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER"));

        if (isRunningInDocker)
        {
            // In Docker, just use HTTP
            serverOptions.ListenAnyIP(8080); // Match port in docker-compose.yml
        }
        else
        {
            // Local development outside Docker
            serverOptions.ListenAnyIP(5000); // HTTP
            serverOptions.ListenAnyIP(5001, listenOptions =>
            {
                listenOptions.UseHttps(); // Uses the dev cert by default for localhost
            });
        }
    }
    else
    {
        // Production code remains unchanged
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

// Register application services (e.g. services, repositories)
builder.Services.AddApplication();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

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
builder.Services.AddOpenIddict()
    .AddValidation(options =>
    {
        options.UseLocalServer();      // <-- This links the validation to your local server
        options.UseAspNetCore();       // <-- Enables JWT validation in ASP.NET Core middleware
    }).AddServer(options =>
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



// Build the application pipeline
var app = builder.Build();

// Configure Forwarded Headers Middleware
// This should be one of the first middleware components configured.
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};
// These are important for environments like Azure Container Apps
forwardedHeadersOptions.KnownNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();

app.UseForwardedHeaders(forwardedHeadersOptions);

// Configure the HTTP request pipeline for the application
if (app.Environment.IsDevelopment())
{
    // Seed the database with initial data in development mode
    // app.Services.SeedDatabaseAsync().Wait();
}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "MerchStore API V1");
});

// Only use HTTPS Redirection if not running in Docker development mode where only HTTP is served
// or if in production and you want to enforce HTTPS (assuming your production setup handles HTTPS termination)
bool isRunningInDockerDevelopment = app.Environment.IsDevelopment() &&
                                   !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER"));

if (!isRunningInDockerDevelopment) // Or more specific conditions based on your HTTPS setup
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAllOrigins"); // Enable CORS policy
app.UseAuthentication();        // Enable authentication middleware
app.UseAuthorization();         // Enable authentication and authorization middleware
app.MapControllers();           // Map API controllers

// Redirect root URL to Swagger UI
app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    try
    {
        if (app.Environment.IsDevelopment())
        {
            Console.WriteLine("Development environment detected: Recreating database...");
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();

            // Seed the database after recreation
            await app.Services.SeedDatabaseAsync();

            Console.WriteLine("Database recreated successfully.");
        }
        else
        {
            Console.WriteLine("Production environment detected: Applying migrations...");
            db.Database.Migrate();
            Console.WriteLine("Migrations applied successfully.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error setting up database: {ex.Message}");
        // Eventuellt logga felet mer detaljerat eller vidta åtgärder
    }
}

// Configure OpenIddict providers
new LoginService(app.Services).StartAsync(default).Wait(); // Start the login service
// Run the application
app.Run();