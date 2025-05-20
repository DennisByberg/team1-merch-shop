using MerchStore.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenIddict.Abstractions;

namespace MerchStore.Infrastructure.ExternalServices;

public class LoginService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public LoginService(IServiceProvider serviceProvider)
        => _serviceProvider = serviceProvider;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.EnsureCreatedAsync();

        var manager = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();

        if (await manager.FindByClientIdAsync("service-worker") is null)
        {
            await manager.CreateAsync(new OpenIddictApplicationDescriptor
            {
                ClientId = "service-worker",
                ClientSecret = "388D45FA-B36B-4988-BA59-B187D329C207",
                Permissions =
                    {
                    OpenIddictConstants.Permissions.Endpoints.Token,
                    OpenIddictConstants.Permissions.Endpoints.Authorization,
                    OpenIddictConstants.Permissions.GrantTypes.ClientCredentials,
                    OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode,
                    OpenIddictConstants.Permissions.ResponseTypes.Code
                    },
                RedirectUris =
                {
                    new Uri("https://localhost:5001/swagger/oauth2-redirect.html"),
                    new Uri("http://localhost:5173/auth/callback"),
                    new Uri("https://oauth.pstmn.io/v1/callback"),
                    new Uri ("https://merchstorefrontend.agreeabledesert-a7938720.swedencentral.azurecontainerapps.io/auth/callback")
                },
                DisplayName = "Admin"
            });
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
