using Microsoft.AspNetCore.Authentication;

namespace MerchStore.WebApi.Authentication.ApiKey;

// Syfte med denna klass: Att definiera inställningar för API-nyckelautentisering i ASP.NET Core.
public class ApiKeyAuthenticationOptions : AuthenticationSchemeOptions
{
    public string HeaderName { get; set; } = ApiKeyAuthenticationDefaults.HeaderName;
    public string ApiKey { get; set; } = string.Empty;
}