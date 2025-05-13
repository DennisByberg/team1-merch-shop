using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MerchStore.Application.Common.Interfaces;
using MerchStore.Domain.Interfaces;
using MerchStore.Infrastructure.Persistence;
using MerchStore.Infrastructure.Persistence.Repositories;
using MerchStore.Infrastructure.ExternalServices.Reviews.Configurations;
using MerchStore.Infrastructure.ExternalServices.Reviews;

namespace MerchStore.Infrastructure;

// Syfte med denna klass: Centralisera all DI-registrering och byt till SQLite.
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IRepositoryManager, RepositoryManager>();
        // Register OpenIddict services
        services.AddOpenIddictServices(configuration);
        services.AddLogging();
        services.AddScoped<AppDbContextSeeder>();

        // Register the external review services
        services.AddReviewServices(configuration);

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
    public static IServiceCollection AddOpenIddictServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOpenIddict()
            .AddCore(options =>
            {
                // Register the Entity Framework Core stores.
                options.UseEntityFrameworkCore()
                    .UseDbContext<AppDbContext>();
            })
            .AddServer(options =>
            {
                // Enable the token endpoint.
                options.SetTokenEndpointUris("/connect/token");

                // Enable the client credentials flow.
                options.AllowClientCredentialsFlow();

                // Register the signing and encryption credentials.
                options.AddDevelopmentEncryptionCertificate()
                    .AddDevelopmentSigningCertificate();

                // Register the ASP.NET Core host and configure the endpoints.
                options.UseAspNetCore()
                    .EnableTokenEndpointPassthrough();
            })
            .AddValidation(options =>
            {
                // Register the ASP.NET Core host.
                options.UseAspNetCore();
                
             
            });

        return services;
    }
}