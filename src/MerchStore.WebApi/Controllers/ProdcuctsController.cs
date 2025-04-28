using Microsoft.AspNetCore.Mvc;
using MerchStore.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using MerchStore.WebApi.Models.Dtos;

namespace MerchStore.WebApi.Controllers;

// Syfte: Exponera produkter via REST API med kontrollerad data (DTO).
[ApiController]
[Route("api/products")]
[Authorize(Policy = "ApiKeyPolicy")]
public class ProductsController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public ProductsController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    // Hämta alla produkter.
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var products = await _catalogService.GetAllProductsAsync();
            var productDtos = products.Select(MapToDto);
            return Ok(productDtos);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Title = "Internal Server Error",
                    Detail = "An error occurred while retrieving products.",
                    Status = StatusCodes.Status500InternalServerError
                });
        }
    }

    // Hämta en specifik produkt via ID.
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var product = await _catalogService.GetProductByIdAsync(id);
            if (product is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Product not found",
                    Detail = $"Product with ID {id} not found",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(MapToDto(product));
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Title = "Internal Server Error",
                    Detail = "An error occurred while retrieving the product.",
                    Status = StatusCodes.Status500InternalServerError
                });
        }
    }

    // Syfte: Mappa domänmodell till DTO.
    private static ProductDto MapToDto(Domain.Entities.Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Price = p.Price.Amount,
        Currency = p.Price.Currency,
        ImageUrl = p.ImageUrl?.ToString(),
        StockQuantity = p.StockQuantity
    };
}