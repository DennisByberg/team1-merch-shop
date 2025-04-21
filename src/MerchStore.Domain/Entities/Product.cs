using MerchStore.Domain.Common;
using MerchStore.Domain.ValueObjects;

namespace MerchStore.Domain.Entities;

public class Product : Entity<Guid>
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public Money Price { get; private set; } = Money.FromSEK(0);
    public int StockQuantity { get; private set; } = 0;
    public Uri? ImageUrl { get; private set; } = null;

    private Product() { } // Privat parameterlös konstruktor för EF Core

    public Product(string name, string description, Uri? imageUrl, Money price, int stockQuantity) : base(Guid.NewGuid())
    {
        // Validera namn
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Product name cannot be empty", nameof(name));
        }

        if (name.Length > 100)
        {
            throw new ArgumentException("Product name cannot exceed 100 characters", nameof(name));
        }

        // Validera beskrivning
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ArgumentException("Product description cannot be empty", nameof(description));
        }

        if (description.Length > 500)
        {
            throw new ArgumentException("Product description cannot exceed 500 characters", nameof(description));
        }

        // Validera bild-URL (om angiven)
        if (imageUrl != null)
        {
            // Tillåt endast http och https
            if (imageUrl.Scheme != "http" && imageUrl.Scheme != "https")
            {
                throw new ArgumentException("Image URL must use HTTP or HTTPS protocol", nameof(imageUrl));
            }

            // Maxlängd på URL
            if (imageUrl.AbsoluteUri.Length > 2000)
            {
                throw new ArgumentException("Image URL exceeds maximum length of 2000 characters", nameof(imageUrl));
            }

            // Kontrollera filändelse
            string extension = Path.GetExtension(imageUrl.AbsoluteUri).ToLowerInvariant();
            string[] validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

            if (!validExtensions.Contains(extension))
            {
                throw new ArgumentException("Image URL must point to a valid image file (jpg, jpeg, png, gif, webp)", nameof(imageUrl));
            }
        }

        // Pris får inte vara null
        ArgumentNullException.ThrowIfNull(price);

        // Lagerantal får inte vara negativt
        if (stockQuantity < 0)
        {
            throw new ArgumentException("Stock quantity cannot be negative", nameof(stockQuantity));
        }

        Name = name;
        Description = description;
        ImageUrl = imageUrl;
        Price = price;
        StockQuantity = stockQuantity;
    }

    public void UpdatePrice(Money newPrice)
    {
        ArgumentNullException.ThrowIfNull(newPrice);

        Price = newPrice;
    }

    public void UpdateStock(int quantity)
    {
        if (quantity < 0)
        {
            throw new ArgumentException("Stock quantity cannot be negative", nameof(quantity));
        }

        StockQuantity = quantity;
    }


    public bool DecrementStock(int quantity = 1)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be positive", nameof(quantity));
        }

        if (StockQuantity < quantity)
        {
            return false;
        }

        StockQuantity -= quantity;

        return true;
    }

    public void IncrementStock(int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be positive", nameof(quantity));
        }

        StockQuantity += quantity;
    }
}