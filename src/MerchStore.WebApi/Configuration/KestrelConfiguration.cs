namespace MerchStore.WebApi.Configuration;

public static class KestrelConfiguration
{
    public static void ConfigureKestrel(this IWebHostBuilder webHost, IWebHostEnvironment environment)
    {
        webHost.ConfigureKestrel(serverOptions =>
        {
            if (environment.IsDevelopment())
            {
                // Check if we're running in Docker
                bool isRunningInDocker = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER"));

                if (isRunningInDocker)
                {
                    serverOptions.ListenAnyIP(8080);
                }
                else
                {
                    // Only HTTP for development to simplify CORS
                    serverOptions.ListenAnyIP(5000);
                }
            }
            else
            {
                // Production
                var portEnvVar = Environment.GetEnvironmentVariable("PORT");
                if (!string.IsNullOrEmpty(portEnvVar) && int.TryParse(portEnvVar, out int port))
                {
                    serverOptions.ListenAnyIP(port);
                }
                else
                {
                    serverOptions.ListenAnyIP(8080);
                }
            }
        });
    }
}