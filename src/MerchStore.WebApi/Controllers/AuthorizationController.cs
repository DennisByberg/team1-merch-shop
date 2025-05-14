using System.Security.Claims;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;

namespace MerchStore.WebApi.Controllers;

public class AuthorizationController: Controller
{
     private readonly IOpenIddictApplicationManager _applicationManager;
         
    public AuthorizationController(IOpenIddictApplicationManager applicationManager)
        => _applicationManager = applicationManager;
// Denna metod körs när en POST-förfrågan görs till /connect/token.
// Den checkar av så att lösenord och clientid är korrekta mot vad som finns i databasen.
    [HttpPost("~/connect/token"), Produces("application/json")]
    public async Task<IActionResult> Exchange()
    {
        using ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole());
          ILogger logger = factory.CreateLogger("auth");
        // kontrollerar att vi har en giltig begäran
        var request = HttpContext.GetOpenIddictServerRequest();
        
        if (request.IsClientCredentialsGrantType())
        {
            // här letar vi tex upp har vi en användare med det clientid?
            var application = await _applicationManager.FindByClientIdAsync(request.ClientId) ??
                throw new InvalidOperationException("The application cannot be found.");

           
            var identity = new ClaimsIdentity(TokenValidationParameters.DefaultAuthenticationType, OpenIddictConstants.Claims.Name, OpenIddictConstants.Claims.Role);

            
            identity.SetClaim(OpenIddictConstants.Claims.Subject, await _applicationManager.GetClientIdAsync(application));
            identity.SetClaim(OpenIddictConstants.Claims.Name, await _applicationManager.GetDisplayNameAsync(application));

            identity.SetDestinations(static claim => claim.Type switch
            {
                // Allow the "name" claim to be stored in both the access and identity tokens
                // when the "profile" scope was granted (by calling principal.SetScopes(...)).
                OpenIddictConstants.Claims.Name when claim.Subject.HasScope(OpenIddictConstants.Permissions.Scopes.Profile)
                    => [OpenIddictConstants.Destinations.AccessToken, OpenIddictConstants.Destinations.IdentityToken],

                // Otherwise, only store the claim in the access tokens.
                _ => [OpenIddictConstants.Destinations.AccessToken]
            });
            logger.LogInformation("created signin");
            return SignIn(new ClaimsPrincipal(identity), OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        throw new NotImplementedException("The specified grant is not implemented.");
    }
}
