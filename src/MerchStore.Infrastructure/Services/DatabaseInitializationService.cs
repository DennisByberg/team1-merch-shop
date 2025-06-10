using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MerchStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

namespace MerchStore.Infrastructure.Services;

public class DatabaseInitializationService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DatabaseInitializationService> _logger;

    public DatabaseInitializationService(
        IServiceProvider serviceProvider,
        ILogger<DatabaseInitializationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var environment = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        try
        {
            if (environment.IsDevelopment())
            {
                if (!await db.Products.AnyAsync(cancellationToken))
                {
                    _logger.LogInformation("Database is empty, seeding data...");
                    await _serviceProvider.SeedDatabaseAsync();
                }
                else
                {
                    _logger.LogInformation("Database already contains data, skipping seed.");
                }

                _logger.LogInformation("Database setup completed successfully.");
            }
            else
            {
                _logger.LogInformation("Production environment detected: Applying migrations...");
                await db.Database.MigrateAsync(cancellationToken);
                _logger.LogInformation("Migrations applied successfully.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting up database: {Message}", ex.Message);
            throw;
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}