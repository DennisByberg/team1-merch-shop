using Microsoft.AspNetCore.HttpOverrides;

namespace MerchStore.WebApi.Configuration;

public static class MiddlewareConfiguration
{
    public static void ConfigureMiddleware(this WebApplication app)
    {
        // Configure Forwarded Headers Middleware
        var forwardedHeadersOptions = new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        };
        forwardedHeadersOptions.KnownNetworks.Clear();
        forwardedHeadersOptions.KnownProxies.Clear();

        app.UseForwardedHeaders(forwardedHeadersOptions);
        app.UseCors();

        // Configure middleware pipeline
        app.UseSwaggerDocumentation();

        // No HTTPS redirection in development to simplify CORS
        if (!app.Environment.IsDevelopment())
        {
            app.UseHttpsRedirection();
        }

        // Authentication and Authorization come AFTER CORS
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        // Redirect root URL to Swagger UI
        app.MapGet("/", context =>
        {
            context.Response.Redirect("/swagger");
            return Task.CompletedTask;
        });
    }
}