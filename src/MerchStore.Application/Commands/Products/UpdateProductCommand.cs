namespace MerchStore.Application.Commands.Products;

public class UpdateProductCommand
{
    public Guid ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int StockQuantity { get; set; }
}