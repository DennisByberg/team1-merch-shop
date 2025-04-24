using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MerchStore.Domain.Entities;
using MerchStore.Domain.ValueObjects;

namespace MerchStore.Infrastructure.Persistence;

public class AppDbContextSeeder
{
    private readonly ILogger<AppDbContextSeeder> _logger;
    private readonly AppDbContext _context;

    public AppDbContextSeeder(AppDbContext context, ILogger<AppDbContextSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Fyller databasen med initialdata
    /// </summary>
    public virtual async Task SeedAsync()
    {
        try
        {
            // Säkerställ att databasen är skapad (behövs bara för in-memory-databas)
            // För SQL Server används istället migrationer
            await _context.Database.EnsureCreatedAsync();

            // Fyll på med produkter om det inte redan finns några
            await SeedProductsAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    /// <summary>
    /// Lägger till exempelprodukter i databasen
    /// </summary>
    private async Task SeedProductsAsync()
    {
        // Kontrollera om det redan finns produkter (för att undvika dubletter)
        if (!await _context.Products.AnyAsync())
        {
            _logger.LogInformation("Seeding products...");

            // Lägg till exempelprodukter
            var products = new List<Product>
            {
                new(
                    "Conference T-Shirt",
                    "A comfortable cotton t-shirt with the conference logo.",
                    // new Uri("https://example.com/images/tshirt.jpg"),
                    new Uri("https://merchstorageno1.blob.core.windows.net/merch/T-hirt.png"),
                    Money.FromSEK(249.99m),
                    50),

                new(
                    "Developer Mug",
                    "A ceramic mug with a funny programming joke.",
                    // new Uri("https://example.com/images/mug.jpg"),
                    new Uri("https://merchstorageno1.blob.core.windows.net/merch/mugg.png"),
                    Money.FromSEK(149.50m),
                    100),

                new(
                    "Cap",
                    "A cap to look cool in",
                    // new Uri("https://example.com/images/stickers.jpg"),
                    new Uri("https://merchstorageno1.blob.core.windows.net/merch/vit keps.png"),
                    Money.FromSEK(79.99m),
                    200),

                new(
                    "Branded Hoodie",
                    "A warm hoodie with the company logo, perfect for cold offices.",
                    // new Uri("https://example.com/images/hoodie.jpg"),
                    new Uri("https://merchstorageno1.blob.core.windows.net/merch/Hoodie.png"),
                    Money.FromSEK(499.99m),
                    25)
            };

            await _context.Products.AddRangeAsync(products);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Product seeding completed successfully.");
        }
        else
        {
            _logger.LogInformation("Database already contains products. Skipping product seed.");
        }
    }
}