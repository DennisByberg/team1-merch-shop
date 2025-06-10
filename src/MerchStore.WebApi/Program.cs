using MerchStore.Application;
using MerchStore.Infrastructure;
using MerchStore.Infrastructure.ExternalServices;
using MerchStore.WebApi.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Azure configuration
builder.Configuration.AddAzureKeyVault();

// Kestrel configuration
builder.WebHost.ConfigureKestrel(builder.Environment);

// Service configuration
builder.Services.AddControllers();
builder.Services.AddWebApiAuthentication(builder.Configuration);
builder.Services.AddCorsConfiguration();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddSwaggerDocumentation();

// Build the application
var app = builder.Build();

// Configure middleware
app.ConfigureMiddleware();

// Configure OpenIddict providers
new LoginService(app.Services).StartAsync(default).Wait();

// Run the application
app.Run();