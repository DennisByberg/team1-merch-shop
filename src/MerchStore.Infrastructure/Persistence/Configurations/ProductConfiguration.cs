using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MerchStore.Domain.Entities;

namespace MerchStore.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        // Ange tabellnamnet explicit
        builder.ToTable("Products");

        // Konfigurera primärnyckeln
        builder.HasKey(p => p.Id);

        // Konfigurera Name-egenskapen
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100); // VARCHAR(100)

        // Konfigurera Description-egenskapen
        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(500); // VARCHAR(500)

        // Konfigurera StockQuantity-egenskapen
        builder.Property(p => p.StockQuantity)
            .IsRequired();

        // Konfigurera ImageUrl-egenskapen
        builder.Property(p => p.ImageUrl)
            .IsRequired(false);

        // Konfigurera value object Money som en komplex typ
        // Mappar Money till kolumner i Products-tabellen
        builder.OwnsOne(p => p.Price, priceBuilder =>
        {
            // Mappar Amount till kolumnen Price
            priceBuilder.Property(m => m.Amount)
                .HasColumnName("Price")
                .IsRequired();

            // Mappar Currency till kolumnen Currency
            priceBuilder.Property(m => m.Currency)
                .HasColumnName("Currency")
                .HasMaxLength(3)
                .IsRequired();
        });

        // Skapa ett index på Name för snabbare sökningar
        builder.HasIndex(p => p.Name);
    }
}