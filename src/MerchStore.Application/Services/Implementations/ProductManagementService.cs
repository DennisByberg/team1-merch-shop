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

    // TODO: Implement other methods like UpdateProductAsync, DeleteProductAsync, etc.
}