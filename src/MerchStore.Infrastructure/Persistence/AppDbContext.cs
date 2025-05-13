using MerchStore.Domain.Entities;
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
    public DbSet<OrderProducts> OrderItems { get; set; } = null!;
    
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
            b.OwnsOne(p => p.Price, mv =>
            {
                mv.Property(m => m.Amount)
                    .HasColumnName("Price")
                    .HasColumnType("decimal(18,2)");

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
            b.HasMany(o => o.Product)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            b.Property(o => o.OrderStatus)
                .HasMaxLength(20)
                .IsRequired();
        });

        // OrderProducts configuration
        mb.Entity<OrderProducts>(b =>
        {
            b.OwnsOne(p => p.UnitPrice, mv =>
            {
                mv.Property(m => m.Amount)
                    .HasColumnName("Price")
                    .HasColumnType("decimal(18,2)");

                mv.Property(m => m.Currency)
                    .HasColumnName("Currency")
                    .HasColumnType("nvarchar(3)")
                    .HasMaxLength(3)
                    .IsRequired();
            });
        });

        // OpenIddict configuration
        mb.UseOpenIddict();
    }
}