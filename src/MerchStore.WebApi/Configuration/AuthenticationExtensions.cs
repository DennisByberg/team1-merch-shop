using Microsoft.AspNetCore.Authentication.Cookies;
using MerchStore.WebApi.Authentication.ApiKey;

namespace MerchStore.WebApi.Configuration;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddWebApiAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        // Add cookie authentication services
        services.AddControllersWithViews();
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie();

        // Add API key authentication
        var apiKeyValue = configuration["ApiKey:Value"];
        if (string.IsNullOrEmpty(apiKeyValue))
        {
            throw new InvalidOperationException("API Key is not configured in appsettings.json or Key Vault.");
        }

        services.AddAuthentication()
           .AddApiKey(apiKeyValue);

        // Add API key authorization policy
        services.AddAuthorization(options =>
        {
            options.AddPolicy("ApiKeyPolicy", policy =>
                policy.AddAuthenticationSchemes(ApiKeyAuthenticationDefaults.AuthenticationScheme)
                      .RequireAuthenticatedUser());
        });

        return services;
    }
}