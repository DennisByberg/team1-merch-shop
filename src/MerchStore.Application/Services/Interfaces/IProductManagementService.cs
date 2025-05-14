using MerchStore.Application.Commands.Products;
using MerchStore.Domain.Entities;

namespace MerchStore.Application.Services.Interfaces;

public interface IProductManagementService
{
    /// <summary>
    /// Creates a new product in the system.
    /// </summary>
    /// <param name="command">The command containing product details.</param>
    /// <returns>The created product.</returns>
    Task<Product> CreateProductAsync(CreateProductCommand command);

    /// <summary>
    /// Updates an existing product in the system.
    /// </summary>
    /// <param name="command">The command containing updated product details.</param>
    /// <returns>The updated product.</returns>
    Task<Product?> UpdateProductAsync(UpdateProductCommand command);

    /// <summary>
    /// Deletes a product from the system.
    /// </summary>
    /// <param name="productId">The ID of the product to delete.</param>
    /// <returns>True if the product was deleted successfully; otherwise, false.</returns>
    Task<bool> DeleteProductAsync(Guid productId);
}