namespace MerchStore.WebUI.Authentication.ApiKey;

public static class ApiKeyAuthenticationDefaults
{
    /// <summary>
    /// Default value for AuthenticationScheme property in the ApiKeyAuthenticationOptions
    /// </summary>
    public const string AuthenticationScheme = "ApiKey";

    /// <summary>
    /// The default header name where the API key is expected to be transmitted
    /// </summary>
    public const string HeaderName = "X-API-Key";
}