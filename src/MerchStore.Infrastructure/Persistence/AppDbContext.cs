using MerchStore.Domain.Entities;
using MerchStore.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using OpenIddict.EntityFrameworkCore.Models;
using OpenIddict.EntityFrameworkCore;

namespace MerchStore.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderProducts> OrderItems { get; set; } = null!; // Notera: DbSet heter OrderItems, klassen OrderProducts

    // sätter upp OpenIddict tabeller i databasen
    public DbSet<OpenIddictEntityFrameworkCoreApplication> Applications { get; set; } = null!;
    public DbSet<OpenIddictEntityFrameworkCoreAuthorization> Authorizations { get; set; } = null!;
    public DbSet<OpenIddictEntityFrameworkCoreScope> Scopes { get; set; } = null!;
    public DbSet<OpenIddictEntityFrameworkCoreToken> Tokens { get; set; } = null!;

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);
        mb.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Product configuration
        mb.Entity<Product>(b =>
        {
            // Explicit definition av primärnyckel
            b.HasKey(p => p.Id);

            b.OwnsOne(p => p.Price, mv =>
            {
                mv.Property(m => m.Amount)
                    .HasColumnName("Price")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                mv.Property(m => m.Currency)
                    .HasColumnName("Currency")
                    .HasColumnType("nvarchar(3)")
                    .HasMaxLength(3)
                    .IsRequired();
            });

            b.HasMany(p => p.OrderProducts)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Order configuration
        mb.Entity<Order>(b =>
        {
            // Explicit definition av primärnyckel
            b.HasKey(o => o.Id);

            b.HasMany(o => o.OrderProducts)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            b.Property(o => o.OrderStatus)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
        });

        // OrderProducts configuration
        mb.Entity<OrderProducts>(b =>
        {
            // Explicit definition av primärnyckel
            b.HasKey(op => op.Id);

            b.OwnsOne(p => p.UnitPrice, mv =>
            {
                mv.Property(m => m.Amount)
                    .HasColumnName("Price")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                mv.Property(m => m.Currency)
                    .HasColumnName("Currency")
                    .HasColumnType("nvarchar(3)")
                    .HasMaxLength(3)
                    .IsRequired();
            });

            b.Property(op => op.Quantity).IsRequired();
        });

        // OpenIddict konfiguration
        mb.UseOpenIddict();
    }
}