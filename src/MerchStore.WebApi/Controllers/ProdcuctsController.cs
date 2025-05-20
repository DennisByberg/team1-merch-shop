using Microsoft.AspNetCore.Mvc;
using MerchStore.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using MerchStore.WebApi.Models.Dtos.Products;
using MerchStore.Application.Commands.Products;
using OpenIddict.Abstractions;
using OpenIddict.Validation.AspNetCore;

namespace MerchStore.WebApi.Controllers;

[ApiController]
[Route("api/products")]

public class ProductsController(
    ICatalogService catalogService,
    IProductManagementService productManagementService,
    IOpenIddictApplicationManager applicationManager) : Controller
{
    private readonly ICatalogService _catalogService = catalogService;
    private readonly IProductManagementService _productManagementService = productManagementService;
    private readonly IOpenIddictApplicationManager _applicationManager = applicationManager;

    [HttpGet]
    [Authorize(Policy = "ApiKeyPolicy")] 
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

    [HttpGet("{id}")]
    [Authorize(Policy = "ApiKeyPolicy")] 
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

    [HttpPost]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequestDto createProductRequestDto)
    {
        var subject = User.FindFirst(OpenIddictConstants.Claims.Subject)?.Value;
        var application = await _applicationManager.FindByClientIdAsync(subject);
        if (application == null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid Client ID",
                Detail = $"Client ID '{User.FindFirst(OpenIddictConstants.Claims.Subject)?.Value}' not found.",
                Status = StatusCodes.Status400BadRequest
            });
        }
        if (!ModelState.IsValid)
        {
            var problemDetails = new ValidationProblemDetails(ModelState)
            {
                Title = "One or more validation errors occurred.",
                Status = StatusCodes.Status400BadRequest,
            };
            return BadRequest(problemDetails);
        }

        try
        {
            // Mappa från WebApi DTO till Application Command
            var command = new CreateProductCommand
            {
                Name = createProductRequestDto.Name,
                Description = createProductRequestDto.Description,
                Price = createProductRequestDto.Price,
                Currency = createProductRequestDto.Currency,
                ImageUrl = createProductRequestDto.ImageUrl,
                StockQuantity = createProductRequestDto.StockQuantity
            };

            // Anropa applikationstjänsten
            var createdDomainProduct = await _productManagementService.CreateProductAsync(command);

            // Mappa den skapade domänentiteten tillbaka till en ProductDto för svaret
            var productResponseDto = MapToDto(createdDomainProduct);

            // Returnera 201 Created med en länk till den nya resursen och den skapade DTO:n
            return CreatedAtAction(nameof(GetById), new { id = productResponseDto.Id }, productResponseDto);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid input for product creation.",
                Detail = ex.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Internal Server Error",
                Detail = "An error occurred while creating the product. " + ex.Message,
                Status = StatusCodes.Status500InternalServerError
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        try
        {
            // Call the application service to delete the product.
            var success = await _productManagementService.DeleteProductAsync(id);

            // If the product was not found, return 404 Not Found.
            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Product not found",
                    Detail = $"Product with ID {id} not found",
                    Status = StatusCodes.Status404NotFound
                });
            }

            // Return 204 No Content if the deletion was successful, best praxis for DELETE requests.
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Internal Server Error",
                Detail = $"An error occurred while attempting to delete product with ID {id}. {ex.Message}",
                Status = StatusCodes.Status500InternalServerError
            });
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequestDto updateProductDto)
    {
        // If the DTO validation fails, return a 400 Bad Request with validation errors.
        if (!ModelState.IsValid)
        {
            var problemDetails = new ValidationProblemDetails(ModelState)
            {
                Title = "One or more validation errors occurred.",
                Status = StatusCodes.Status400BadRequest,
            };

            return BadRequest(problemDetails);
        }

        try
        {
            // Map the DTO to an UpdateProductCommand.
            var command = new UpdateProductCommand
            {
                ProductId = id,
                Name = updateProductDto.Name,
                Description = updateProductDto.Description,
                Price = updateProductDto.Price,
                Currency = updateProductDto.Currency,
                ImageUrl = updateProductDto.ImageUrl,
                StockQuantity = updateProductDto.StockQuantity
            };

            // Call the application service to update the product.
            var updatedDomainProduct = await _productManagementService.UpdateProductAsync(command);

            if (updatedDomainProduct is null)
            {
                // If the service indicates the product was not found, return 404 Not Found.
                return NotFound(new ProblemDetails
                {
                    Title = "Product not found",
                    Detail = $"Product with ID {id} not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            // Map the updated domain entity back to a ProductDto for the response.
            var productResponseDto = MapToDto(updatedDomainProduct);

            // Return 200 OK with the updated product DTO.
            return Ok(productResponseDto);
        }

        // Catch specific exceptions related to invalid input.
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid input for product update.",
                Detail = ex.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }

        // Catch any other exceptions that may occur during the update process.
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Internal Server Error",
                Detail = $"An error occurred while updating product with ID {id}. Please try again later.", // Undvik att läcka ex.Message i produktion om den är för detaljerad.
                Status = StatusCodes.Status500InternalServerError
            });
        }
    }

    // Helper method to map domain entity to DTO.
    private static ProductDto MapToDto(Domain.Entities.Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description,
        Price = product.Price.Amount,
        Currency = product.Price.Currency,
        ImageUrl = product.ImageUrl?.ToString(),
        StockQuantity = product.StockQuantity
    };
}