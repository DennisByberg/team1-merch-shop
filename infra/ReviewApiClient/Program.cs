using System.Text.Json;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

class Program
{
    static async Task Main(string[] args)
    {
        try
        {
            string keyVaultUrl = "https://merchstorekeyvault.vault.azure.net/";

            // Create a SecretClient to interact with Azure Key Vault
            var secretClient = new SecretClient(new Uri(keyVaultUrl), new DefaultAzureCredential());

            // Retrieve the value of the secrets
            string functionAppName = (await secretClient.GetSecretAsync("ReviewApiFunctionAppName")).Value.Value;
            string functionKey = (await secretClient.GetSecretAsync("ReviewApiFunctionKey")).Value.Value;

            // Generate a random product ID (GUID) for testing
            string productId = Guid.NewGuid().ToString();

            // Create an HttpClient instance for making requests
            using var httpClient = new HttpClient();

            Console.WriteLine("Review API Client Test");
            Console.WriteLine("=====================");
            Console.WriteLine($"Product ID: {productId}");
            Console.WriteLine();

            // API Key in Header (recommended)
            string urlWithHeader = $"https://{functionAppName}.azurewebsites.net/api/products/{productId}/reviews";
            Console.WriteLine("API Key in Header");
            Console.WriteLine($"Requesting from: {urlWithHeader}");
            Console.WriteLine($"With header: x-functions-key: {functionKey}");
            Console.WriteLine();

            // Create a new request message with the header
            var request = new HttpRequestMessage(HttpMethod.Get, urlWithHeader);
            request.Headers.Add("x-functions-key", functionKey);

            // Send the request and get the response
            var headerResponse = await httpClient.SendAsync(request);
            headerResponse.EnsureSuccessStatusCode();

            var responseWithHeader = await headerResponse.Content.ReadAsStringAsync();

            // Output the raw response
            Console.WriteLine("Response from header method:");
            Console.WriteLine(responseWithHeader);
            Console.WriteLine();

            // Parse and display the response in a more readable format
            var options = new JsonSerializerOptions { WriteIndented = true };
            var formattedJsonHeader = JsonSerializer.Serialize(
                JsonSerializer.Deserialize<JsonElement>(responseWithHeader),
                options);

            Console.WriteLine("Formatted response (header):");
            Console.WriteLine(formattedJsonHeader);
            Console.WriteLine("===========================================");
            Console.WriteLine();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner error: {ex.InnerException.Message}");
            }
        }
    }
}