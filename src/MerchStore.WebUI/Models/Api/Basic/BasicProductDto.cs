namespace MerchStore.WebUI.Models.Api.Basic;

/// <summary>
/// Simple Data Transfer Object for product information in the Basic API.
/// </summary>
/// <remarks>
/// This DTO contains only the essential product information needed for the Basic API response.
/// It's intentionally kept separate from DTOs used in other API implementations to allow
/// independent evolution.
/// </remarks>
public class BasicProductDto
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