using Microsoft.Extensions.DependencyInjection;
using MerchStore.Application.Services.Implementations;
using MerchStore.Application.Services.Interfaces;

namespace MerchStore.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register application services
        services.AddScoped<ICatalogService, CatalogService>();
        services.AddScoped<IProductManagementService, ProductManagementService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IOrderService, OrderService>();

        return services;
    }
}