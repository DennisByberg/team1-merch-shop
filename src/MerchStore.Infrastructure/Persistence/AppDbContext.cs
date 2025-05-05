using MerchStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MerchStore.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    // ─────────────  DbSets  ─────────────
    public DbSet<Product>    Products    { get; set; } = null!;
    public DbSet<Order>      Orders      { get; set; } = null!;
    public DbSet<OrderProducts>  OrderItems  { get; set; } = null!;

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // ─────────────  Modell­konfiguration  ─────────────
    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);
        mb.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // -------- Product --------
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

            // 1-många: Product → OrderItems
            b.HasMany(p => p.OrderProducts)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // -------- Order --------
        mb.Entity<Order>(b =>
        {

            // 1-många: Order → OrderItems
            b.HasMany(o => o.Product)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // -------- OrderItem --------
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
    }
}