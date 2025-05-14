using System.ComponentModel.DataAnnotations;

namespace MerchStore.WebApi.Models.Dtos.Products;

public class CreateProductRequestDto
{
    [Required(ErrorMessage = "Product name is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Product name must be between 3 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Product description is required.")]
    [StringLength(500, ErrorMessage = "Description can be at most 500 characters.")]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Currency is required.")]
    [StringLength(3, MinimumLength = 3, ErrorMessage = "Currency code must be 3 characters long.")]
    [RegularExpression("^[A-Z]{3}$", ErrorMessage = "Currency code must be 3 uppercase letters (ISO 4217 format).")]
    public string Currency { get; set; } = string.Empty;

    [Url(ErrorMessage = "Invalid URL format for ImageUrl.")]
    public string? ImageUrl { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative.")]
    public int StockQuantity { get; set; }
}