using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MerchStore.Domain.Entities;
using MerchStore.Domain.ValueObjects;
using MerchStore.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

    // Fyller databasen med initialdata
    public virtual async Task SeedAsync()
    {
        try
        {
            // För utvecklingsmiljöer där databasen återskapas vid varje start,
            // kan EnsureCreatedAsync() vara relevant.
            // För produktionsliknande miljöer med migrationer,
            // är det oftast ApplyMigrationsAsync() som gäller.
            // Denna rad kan behöva anpassas beroende på din databasstrategi.
            // await _context.Database.EnsureCreatedAsync(); // Kommentera ut eller anpassa vid behov

            _logger.LogInformation("Attempting to seed database...");

            // Fyll på med produkter om det inte redan finns några
            await SeedProductsAsync();

            // Fyll på med ordrar om det inte redan finns några
            await SeedOrdersAsync();

            _logger.LogInformation("Database seeding process completed.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            // Det är viktigt att kasta vidare felet så att applikationen
            // eventuellt kan hantera det eller misslyckas med att starta,
            // vilket indikerar ett allvarligt problem.
            throw;
        }
    }

    // Denna metod fyller på med exempelprodukter i databasen
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
                    new Uri("https://merchstorageno1.blob.core.windows.net/merch/T-hirt.png"),
                    Money.FromSEK(249.99m), // Assuming Money.FromSEK creates a new Money instance
                    99),

                new(
                    "Developer Mug",
                    "A ceramic mug with a funny programming joke.",
                    new Uri("https://merchstorageno1.blob.core.windows.net/merch/mugg.png"),
                    Money.FromSEK(149.50m),
                    99),

                new(
                    "Cap",
                    "A cap to look cool in",
                    new Uri("https://merchstorageno1.blob.core.windows.net/merch/vit keps.png"),
                    Money.FromSEK(79.99m),
                    99),

                new(
                    "Branded Hoodie",
                    "A warm hoodie with the company logo, perfect for cold offices.",
                    new Uri("https://merchstorageno1.blob.core.windows.net/merch/Hoodie.png"),
                    Money.FromSEK(499.99m),
                    99)
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

    // Denna metod fyller på med exempelordrar i databasen
    private async Task SeedOrdersAsync()
    {
        // Kontrollera om det redan finns ordrar (för att undvika dubletter)
        if (await _context.Orders.AnyAsync())
        {
            _logger.LogInformation("Database already contains orders. Skipping order seed.");
            return;
        }

        // Hämta produkter som ska användas i ordrarna
        // Se till att du hämtar tillräckligt många och de du förväntar dig
        var products = await _context.Products.OrderBy(p => p.Name).Take(3).ToListAsync(); // OrberBy för konsekvent urval

        if (products.Count < 3)
        {
            _logger.LogWarning($"Not enough products to seed orders. Expected at least 3, but found {products.Count}. Skipping order seed.");
            return;
        }

        _logger.LogInformation("Seeding orders...");

        var orders = new List<Order>
        {
            new( // Order 1
                "Ada Lovelace",
                "ada@lovelace.com",
                "Logic Street 1",
                "12345",
                "London",
                "UK",
                OrderStatus.Pending,
                new List<OrderProducts>
                {
                    // Use the Money constructor directly
                    new() { ProductId = products[0].Id, Quantity = 2, UnitPrice = new Money(products[0].Price.Amount, products[0].Price.Currency) },
                    new() { ProductId = products[1].Id, Quantity = 1, UnitPrice = new Money(products[1].Price.Amount, products[1].Price.Currency) }
                }
            ),
            new( // Order 2
                "Grace Hopper",
                "grace@hopper.com",
                "Compiler Ave 42",
                "54321",
                "New York",
                "USA",
                OrderStatus.Pending,
                new List<OrderProducts>
                {
                    // Use the Money constructor directly
                    new() { ProductId = products[1].Id, Quantity = 3, UnitPrice = new Money(products[1].Price.Amount, products[1].Price.Currency) }
                }
            ),
            new( // Order 3
                "Linus Torvalds",
                "linus@linux.org",
                "Kernel Road 7",
                "67890",
                "Helsinki",
                "Finland",
                OrderStatus.Pending,
                new List<OrderProducts>
                {
                    // Use the Money constructor directly
                    new() { ProductId = products[2].Id, Quantity = 1, UnitPrice = new Money(products[2].Price.Amount, products[2].Price.Currency) }
                }
            )
        };

        await _context.Orders.AddRangeAsync(orders);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Order seeding completed successfully.");
    }
}