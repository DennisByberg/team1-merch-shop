using MerchStore.Application.Commands.Products;
using MerchStore.Application.Common.Interfaces;
using MerchStore.Application.Services.Interfaces;
using MerchStore.Domain.Entities;
using MerchStore.Domain.Interfaces;
using MerchStore.Domain.ValueObjects;

namespace MerchStore.Application.Services.Implementations;

public class ProductManagementService(IProductRepository productRepository, IUnitOfWork unitOfWork) : IProductManagementService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<Product> CreateProductAsync(CreateProductCommand command)
    {
        ArgumentNullException.ThrowIfNull(command);

        Money price;
        // Attempt to create the Money value object from command properties, handling potential errors.
        try
        {
            price = new Money(command.Price, command.Currency);
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"Invalid price or currency format: {command.Price} {command.Currency}. Details: {ex.Message}", ex);
        }

        Uri? imageUrl = null;
        // Attempt to create the Uri for ImageUrl if present, validating its format and scheme.
        if (!string.IsNullOrWhiteSpace(command.ImageUrl))
        {
            if (Uri.TryCreate(command.ImageUrl, UriKind.Absolute, out var parsedUri) &&
                (parsedUri.Scheme == Uri.UriSchemeHttp || parsedUri.Scheme == Uri.UriSchemeHttps))
            {
                imageUrl = parsedUri;
            }
            else
            {
                throw new ArgumentException($"Invalid ImageUrl format or scheme: {command.ImageUrl}", nameof(command.ImageUrl));
            }
        }

        // Create a new product entity
        var product = new Product(
            name: command.Name,
            description: command.Description,
            imageUrl: imageUrl,
            price: price,
            stockQuantity: command.StockQuantity
        );

        await _productRepository.AddAsync(product); // Add the product to the repository
        await _unitOfWork.SaveChangesAsync(); // Save changes to the database

        return product; // Return the created product
    }

    public async Task<bool> DeleteProductAsync(Guid productId)
    {
        // Retrieve the product from the repository using the injected _productRepository
        var product = await _productRepository.GetByIdAsync(productId);

        if (product is null)
        {
            return false;
        }

        try
        {
            // Delete the product from the repository
            await _productRepository.RemoveAsync(product);

            // Save changes to the database
            await _unitOfWork.SaveChangesAsync();

            // Return true if the product was deleted successfully
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<Product?> UpdateProductAsync(UpdateProductCommand command)
    {
        ArgumentNullException.ThrowIfNull(command);

        var productToUpdate = await _productRepository.GetByIdAsync(command.ProductId);

        if (productToUpdate is null)
        {
            return null;
        }

        // Validate and create Money value object for price.
        Money price;
        try
        {
            price = new Money(command.Price, command.Currency);
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException($"Invalid price or currency for update: {command.Price} {command.Currency}. Details: {ex.Message}", ex);
        }

        // Validate and create Uri for ImageUrl if present.
        Uri? newImageUrl;
        if (command.ImageUrl == null)
        {
            newImageUrl = productToUpdate.ImageUrl;
        }

        else if (string.IsNullOrWhiteSpace(command.ImageUrl))
        {
            newImageUrl = null;
        }

        else if (Uri.TryCreate(command.ImageUrl, UriKind.Absolute, out var parsedUri) &&
                 (parsedUri.Scheme == Uri.UriSchemeHttp || parsedUri.Scheme == Uri.UriSchemeHttps))
        {
            newImageUrl = parsedUri;
        }

        else
        {
            throw new ArgumentException($"Invalid ImageUrl format or scheme for update: {command.ImageUrl}", nameof(command.ImageUrl));
        }

        productToUpdate.UpdateDetails(command.Name, command.Description, newImageUrl);
        productToUpdate.UpdatePrice(price);
        productToUpdate.UpdateStock(command.StockQuantity);

        try
        {
            // Update the product in the repository.
            await _productRepository.UpdateAsync(productToUpdate);

            // Save changes to the database.
            await _unitOfWork.SaveChangesAsync();

            // Return the updated product.
            return productToUpdate;
        }
        catch
        {
            throw;
        }
    }
}