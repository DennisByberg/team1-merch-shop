using Azure.Identity;

namespace MerchStore.WebApi.Configuration;

public static class AzureConfiguration
{
    public static void AddAzureKeyVault(this ConfigurationManager configuration)
    {
        var keyVaultUri = new Uri("https://merchstorekeyvault.vault.azure.net/");
        configuration.AddAzureKeyVault(keyVaultUri, new DefaultAzureCredential());
    }
}