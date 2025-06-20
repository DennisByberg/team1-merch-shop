using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MerchStore.Application.Common.Interfaces;
using MerchStore.Domain.Interfaces;
using MerchStore.Infrastructure.Persistence;
using MerchStore.Infrastructure.Persistence.Repositories;
using MerchStore.Infrastructure.ExternalServices.Reviews.Configurations;
using MerchStore.Infrastructure.ExternalServices.Reviews;
using MerchStore.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;


namespace MerchStore.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Add database context
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                sqlOptions => sqlOptions.MigrationsAssembly("MerchStore.Infrastructure")
            ));

        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IRepositoryManager, RepositoryManager>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Register OpenIddict services
        services.AddOpenIddictServices(configuration);
        services.AddLogging();
        services.AddScoped<AppDbContextSeeder>();

        // Register the external review services
        services.AddReviewServices(configuration);

        // Add database initialization as a hosted service
        services.AddHostedService<DatabaseInitializationService>();

        return services;
    }

    // This method is responsible for registering the external review services.
    public static IServiceCollection AddReviewServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<ReviewApiOptions>(configuration.GetSection(ReviewApiOptions.SectionName));
        services.AddHttpClient<ReviewApiClient>().SetHandlerLifetime(TimeSpan.FromMinutes(5));
        services.AddSingleton<MockReviewService>();
        services.AddScoped<IReviewRepository, ExternalReviewRepository>();

        return services;
    }

    // This method is responsible for seeding the database with initial data.
    public static async Task SeedDatabaseAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var seeder = scope.ServiceProvider.GetRequiredService<AppDbContextSeeder>();
        await seeder.SeedAsync();
    }

    // This method is responsible for registering OpenIddict services.
    public static IServiceCollection AddOpenIddictServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOpenIddict()
        .AddCore(options =>
        {
            options.UseEntityFrameworkCore()
                .UseDbContext<AppDbContext>();
        })
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

            // Use ephemeral keys for development instead of certificates
            options.AddEphemeralEncryptionKey()
                .AddEphemeralSigningKey();

            options.UseAspNetCore()
                .EnableTokenEndpointPassthrough()
                .EnableAuthorizationEndpointPassthrough()
                .DisableTransportSecurityRequirement(); // Allow HTTP in development

            var isDevelopment = configuration.GetValue<bool>("IsDevelopment") ||
                              Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

            if (isDevelopment)
            {
                options.DisableAccessTokenEncryption(); // Disable encryption for development
            }
        });

        return services;
    }
}