// Syfte: Håller konstanter för API-nyckelautentisering (namn på scheme och header).
namespace MerchStore.WebApi.Authentication.ApiKey;

// Syfte med denna klass: Att definiera standardvärden för autentisering med API-nyckel i ASP.NET Core.
public static class ApiKeyAuthenticationDefaults
{
    public const string AuthenticationScheme = "ApiKey";
    public const string HeaderName = "X-API-Key";
}