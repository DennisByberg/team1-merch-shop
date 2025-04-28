using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace MerchStore.WebApi.Authentication.ApiKey;

// Syfte med denna klass: Att hantera autentisering med API-nyckel i ASP.NET Core.
public class ApiKeyAuthenticationHandler : AuthenticationHandler<ApiKeyAuthenticationOptions>
{
    public ApiKeyAuthenticationHandler(
        IOptionsMonitor<ApiKeyAuthenticationOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue(Options.HeaderName, out var apiKeyHeaderValues))
        {
            Logger.LogWarning("API key missing. Header '{HeaderName}' not found in the request.", Options.HeaderName);
            return Task.FromResult(AuthenticateResult.Fail($"API key header '{Options.HeaderName}' not found."));
        }

        var providedApiKey = apiKeyHeaderValues.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(providedApiKey))
        {
            Logger.LogWarning("API key is empty. Header '{HeaderName}' has no value.", Options.HeaderName);
            return Task.FromResult(AuthenticateResult.Fail("API key is empty."));
        }

        if (providedApiKey != Options.ApiKey)
        {
            Logger.LogWarning("Invalid API key provided: {ProvidedKey}", providedApiKey);
            return Task.FromResult(AuthenticateResult.Fail("Invalid API key."));
        }

        var claims = new[] { new Claim(ClaimTypes.Name, "API User") };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        Logger.LogInformation("API key authentication successful");
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}