using Microsoft.EntityFrameworkCore;
using MerchStore.Domain.Entities;

namespace MerchStore.Infrastructure.Persistence;

// Syfte med denna klass: DbContext är din "session" mot databasen och hanterar alla entiteter.
public class AppDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}