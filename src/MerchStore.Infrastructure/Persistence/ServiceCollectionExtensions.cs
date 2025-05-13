using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;
using OpenIddict.EntityFrameworkCore;
using OpenIddict.Server.AspNetCore;
using OpenIddict.Validation.AspNetCore;

namespace MerchStore.Infrastructure.Persistence
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Konfigurerar AppDbContext med OpenIddict (Server) och tokenintrospection-baserad validering (v6.2.1).
        /// </summary>
        public static IServiceCollection AddOpenIddictProvider(this IServiceCollection services, string connectionString)
        {
            // 1) DbContext med OpenIddict-modeller
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlite(connectionString);
                options.UseOpenIddict();
            });

            // 2) Konfigurera OpenIddict: Core, Server och Validation
            services.AddOpenIddict()
                // Core: Entity Framework Core stores
                .AddCore(coreOptions => coreOptions
                    .UseEntityFrameworkCore()
                    .UseDbContext<AppDbContext>())

                // Server: endpoints och flows
                .AddServer(serverOptions =>
                {
                    serverOptions.SetAuthorizationEndpointUris("/connect/authorize")
                                 .SetTokenEndpointUris("/connect/token")
                                 .SetIntrospectionEndpointUris("/connect/introspect");

                    serverOptions.AllowAuthorizationCodeFlow()
                                 .AllowRefreshTokenFlow();

                    serverOptions.RegisterScopes(Scopes.Email, Scopes.Profile, Scopes.OfflineAccess);

                    serverOptions.AddDevelopmentEncryptionCertificate()
                                 .AddDevelopmentSigningCertificate();

                    serverOptions.UseAspNetCore()
                                 .EnableAuthorizationEndpointPassthrough()
                                 .EnableTokenEndpointPassthrough();
                })

                // Validation: introspection-baserad tokenvalidering
                .AddValidation(validationOptions =>
                {
                    validationOptions.SetIssuer("https://localhost:5001/");
                    validationOptions.UseIntrospection()
                                     .SetClientId("webshop-client")
                                     .SetClientSecret("hemligt-lösen");

                    validationOptions.UseAspNetCore();
                });

            // 3) Konfigurera Authentication för att använda OpenIddict-validation
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
            });

            return services;
        }

        /// <summary>
        /// Seedar standardklienter för OpenIddict vid uppstart.
        /// </summary>
        public static async Task SeedOpenIddictClientsAsync(this IServiceProvider provider)
        {
            using var scope = provider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var mgr     = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();

            // Kör alla EF Core-migrationer
            await context.Database.MigrateAsync();

            const string clientId = "webshop-client";
            if (await mgr.FindByClientIdAsync(clientId) is null)
            {
                var descriptor = new OpenIddictApplicationDescriptor
                {
                    ClientId     = clientId,
                    ClientSecret = "hemligt-lösen",
                    DisplayName  = "MerchStore Webshop SPA"
                };

                // Redirect URIs
                descriptor.RedirectUris.Add(new Uri("https://localhost:5001/callback"));

                // Endpoints
                descriptor.Permissions.Add(Permissions.Endpoints.Authorization);
                descriptor.Permissions.Add(Permissions.Endpoints.Token);
                descriptor.Permissions.Add(Permissions.Endpoints.Introspection);

                // Grant types
                descriptor.Permissions.Add(Permissions.GrantTypes.AuthorizationCode);
                descriptor.Permissions.Add(Permissions.GrantTypes.RefreshToken);

                // Response types
                descriptor.Permissions.Add(Permissions.ResponseTypes.Code);

                // Scopes
                descriptor.Permissions.Add(Permissions.Prefixes.Scope + Scopes.Email);
                descriptor.Permissions.Add(Permissions.Prefixes.Scope + Scopes.Profile);
                descriptor.Permissions.Add(Permissions.Prefixes.Scope + Scopes.OfflineAccess);

                await mgr.CreateAsync(descriptor);
            }
        }
    }
}
