namespace MerchStore.WebApi.Models.Dtos.Products;

// Syfte: Separera domänmodell från API-respons.
public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int StockQuantity { get; set; }
    public bool InStock => StockQuantity > 0;
}