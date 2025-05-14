using Moq;
using FluentAssertions;
using MerchStore.Application.Services.Implementations;
using MerchStore.Domain.Entities;
using MerchStore.Domain.Interfaces;
using MerchStore.Application.Common.Interfaces;
using MerchStore.Domain.ValueObjects;
using MerchStore.Application.Commands.Products;

namespace MerchStore.Application.UnitTests.Services.Implementations
{
    public class ProductManagementServiceTests
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly ProductManagementService _productManagementService;

        public ProductManagementServiceTests()
        {
            _mockProductRepository = new Mock<IProductRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _productManagementService = new ProductManagementService(_mockProductRepository.Object, _mockUnitOfWork.Object);
        }

        // --- Helper for CreateProductAsync Tests ---
        private static CreateProductCommand CreateValidProductCommand(
            string name = "New Awesome Product",
            string description = "This is a great product.",
            string? imageUrl = "https://example.com/image.png",
            decimal price = 29.99m,
            string currency = "USD",
            int stockQuantity = 100)
        {
            return new CreateProductCommand
            {
                Name = name,
                Description = description,
                ImageUrl = imageUrl,
                Price = price,
                Currency = currency,
                StockQuantity = stockQuantity
            };
        }

        // --- Tests for CreateProductAsync ---
        [Fact]
        public async Task CreateProductAsync_WithValidCommand_ShouldAddProductAndSaveChanges_AndReturnProduct()
        {
            // Arrange
            var command = CreateValidProductCommand();
            Product? capturedProduct = null;

            _mockProductRepository
                .Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                .Callback<Product>(p => capturedProduct = p)
                .Returns(Task.CompletedTask);

            _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync(default))
                .ReturnsAsync(1);

            // Act
            var result = await _productManagementService.CreateProductAsync(command);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(command.Name);
            result.Description.Should().Be(command.Description);
            result.ImageUrl.Should().Be(new Uri(command.ImageUrl!));
            result.Price.Amount.Should().Be(command.Price);
            result.Price.Currency.Should().Be(command.Currency);
            result.StockQuantity.Should().Be(command.StockQuantity);
            result.Id.Should().NotBeEmpty(); // Product constructor should assign an ID

            _mockProductRepository.Verify(repo => repo.AddAsync(It.Is<Product>(p =>
                p.Name == command.Name &&
                p.Description == command.Description &&
                p.ImageUrl!.ToString() == command.ImageUrl &&
                p.Price.Amount == command.Price &&
                p.Price.Currency == command.Currency &&
                p.StockQuantity == command.StockQuantity
            )), Times.Once);

            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Once);

            capturedProduct.Should().NotBeNull();
            capturedProduct.Should().BeEquivalentTo(result, options => options.Excluding(p => p.Id));
        }

        [Fact]
        public async Task CreateProductAsync_WithNullCommand_ShouldThrowArgumentNullException()
        {
            // Arrange
            CreateProductCommand command = null!;

            // Act
            Func<Task> act = async () => await _productManagementService.CreateProductAsync(command);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>().WithParameterName("command");

            _mockProductRepository.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Never);
        }

        [Fact]
        public async Task CreateProductAsync_WithInvalidPrice_ShouldThrowArgumentException()
        {
            // Arrange
            var command = CreateValidProductCommand(price: -10m);

            // Act
            Func<Task> act = async () => await _productManagementService.CreateProductAsync(command);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage($"Invalid price or currency format: {command.Price} {command.Currency}. Details: *");

            _mockProductRepository.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Never);
        }

        [Fact]
        public async Task CreateProductAsync_WithInvalidCurrency_ShouldThrowArgumentException()
        {
            // Arrange
            var command = CreateValidProductCommand(currency: "INVALID");

            // Act
            Func<Task> act = async () => await _productManagementService.CreateProductAsync(command);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage($"Invalid price or currency format: {command.Price} {command.Currency}. Details: *");

            _mockProductRepository.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Never);
        }


        [Fact]
        public async Task CreateProductAsync_WithNullImageUrl_ShouldCreateProductWithNullImageUrl()
        {
            // Arrange
            var command = CreateValidProductCommand(imageUrl: null);

            _mockProductRepository.Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                .Returns(Task.CompletedTask);
            _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync(default))
                .ReturnsAsync(1);

            // Act
            var result = await _productManagementService.CreateProductAsync(command);

            // Assert
            result.Should().NotBeNull();
            result.ImageUrl.Should().BeNull();
            _mockProductRepository.Verify(repo => repo.AddAsync(It.Is<Product>(p => p.ImageUrl == null)), Times.Once);
        }

        [Fact]
        public async Task CreateProductAsync_WithEmptyOrWhitespaceImageUrl_ShouldCreateProductWithNullImageUrl()
        {
            // Arrange
            var command = CreateValidProductCommand(imageUrl: "   ");

            _mockProductRepository.Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                .Returns(Task.CompletedTask);
            _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync(default))
                .ReturnsAsync(1);

            // Act
            var result = await _productManagementService.CreateProductAsync(command);

            // Assert
            result.Should().NotBeNull();
            result.ImageUrl.Should().BeNull();
            _mockProductRepository.Verify(repo => repo.AddAsync(It.Is<Product>(p => p.ImageUrl == null)), Times.Once);
        }

        [Fact]
        public async Task CreateProductAsync_WithInvalidImageUrlFormat_ShouldThrowArgumentException()
        {
            // Arrange
            var invalidUrl = "this-is-not-a-valid-url";
            var command = CreateValidProductCommand(imageUrl: invalidUrl);

            // Act
            Func<Task> act = async () => await _productManagementService.CreateProductAsync(command);

            // Assert
            (await act.Should().ThrowAsync<ArgumentException>())
                .WithMessage($"Invalid ImageUrl format or scheme: {invalidUrl} (Parameter '{nameof(command.ImageUrl)}')") // Updated message
                .And.ParamName.Should().Be(nameof(command.ImageUrl));

            _mockProductRepository.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Never);
        }

        [Fact]
        public async Task CreateProductAsync_WithImageUrlInvalidScheme_ShouldThrowArgumentException()
        {
            // Arrange
            var invalidSchemeUrl = "ftp://example.com/image.png";
            var command = CreateValidProductCommand(imageUrl: invalidSchemeUrl);

            // Act
            Func<Task> act = async () => await _productManagementService.CreateProductAsync(command);

            // Assert
            (await act.Should().ThrowAsync<ArgumentException>())
                .WithMessage($"Invalid ImageUrl format or scheme: {invalidSchemeUrl} (Parameter '{nameof(command.ImageUrl)}')") // Updated message
                .And.ParamName.Should().Be(nameof(command.ImageUrl));

            _mockProductRepository.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Never);
        }

        [Fact]
        public async Task CreateProductAsync_WhenAddAsyncFails_ShouldThrowExceptionAndNotSaveChanges()
        {
            // Arrange
            var command = CreateValidProductCommand();
            var dbException = new InvalidOperationException("Database Add failed");

            _mockProductRepository.Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                .ThrowsAsync(dbException);

            // Act
            Func<Task> act = async () => await _productManagementService.CreateProductAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Database Add failed");
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Never);
        }

        [Fact]
        public async Task CreateProductAsync_WhenSaveChangesAsyncFails_ShouldThrowException()
        {
            // Arrange
            var command = CreateValidProductCommand();
            var dbException = new InvalidOperationException("Database SaveChanges failed");

            _mockProductRepository.Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                .Returns(Task.CompletedTask);
            _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync(default))
                .ThrowsAsync(dbException);

            // Act
            Func<Task> act = async () => await _productManagementService.CreateProductAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Database SaveChanges failed");
            _mockProductRepository.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Once);
        }

        // --- Helper for DeleteProductAsync Tests ---
        private static Product CreateTestProduct() // Used by Delete tests
        {
            return new Product(
                 "Test Product",
                 "Test Description",
                 new Uri("https://example.com/image.jpg"),
                 new Money(19.99m, "USD"),
                 10
            );
        }

        // --- Tests for DeleteProductAsync ---
        [Fact]
        public async Task DeleteProductAsync_WhenProductExists_ShouldReturnTrue_AndSaveChanges()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var productToReturn = CreateTestProduct();

            _mockProductRepository.Setup(repo => repo.GetByIdAsync(productId))
                .ReturnsAsync(productToReturn);
            _mockProductRepository.Setup(repo => repo.RemoveAsync(productToReturn))
                .Returns(Task.CompletedTask);
            _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync(default))
                .ReturnsAsync(1);

            // Act
            var result = await _productManagementService.DeleteProductAsync(productId);

            // Assert
            result.Should().BeTrue();

            _mockProductRepository.Verify(repo => repo.GetByIdAsync(productId), Times.Once);
            _mockProductRepository.Verify(repo => repo.RemoveAsync(productToReturn), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Once);
        }

        [Fact]
        public async Task DeleteProductAsync_WhenProductDoesNotExist_ShouldReturnFalse_AndNotSaveChanges()
        {
            // Arrange
            var productId = Guid.NewGuid();
            _mockProductRepository.Setup(repo => repo.GetByIdAsync(productId))
                .ReturnsAsync((Product?)null);

            // Act
            var result = await _productManagementService.DeleteProductAsync(productId);

            // Assert
            result.Should().BeFalse();

            _mockProductRepository.Verify(repo => repo.GetByIdAsync(productId), Times.Once);
            _mockProductRepository.Verify(repo => repo.RemoveAsync(It.IsAny<Product>()), Times.Never);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Never);
        }

        [Fact]
        public async Task DeleteProductAsync_WhenSaveChangesFails_ShouldReturnFalse()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var productToReturn = CreateTestProduct();

            _mockProductRepository.Setup(repo => repo.GetByIdAsync(productId))
                .ReturnsAsync(productToReturn);
            _mockProductRepository.Setup(repo => repo.RemoveAsync(productToReturn))
                .Returns(Task.CompletedTask);
            _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync(default))
                .ThrowsAsync(new Exception("Database save failed"));

            // Act
            var result = await _productManagementService.DeleteProductAsync(productId);

            // Assert
            result.Should().BeFalse();

            _mockProductRepository.Verify(repo => repo.GetByIdAsync(productId), Times.Once);
            _mockProductRepository.Verify(repo => repo.RemoveAsync(productToReturn), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Once);
        }

        [Fact]
        public async Task DeleteProductAsync_WhenRepositoryRemoveFails_ShouldReturnFalse()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var productToReturn = new Product("Test Delete", "Desc", null, new Money(10, "USD"), 1);


            _mockProductRepository.Setup(repo => repo.GetByIdAsync(productId))
                .ReturnsAsync(productToReturn);
            _mockProductRepository.Setup(repo => repo.RemoveAsync(productToReturn))
                .ThrowsAsync(new Exception("Repository remove failed"));

            // Act
            var result = await _productManagementService.DeleteProductAsync(productId);

            // Assert
            result.Should().BeFalse();

            _mockProductRepository.Verify(repo => repo.GetByIdAsync(productId), Times.Once);
            _mockProductRepository.Verify(repo => repo.RemoveAsync(productToReturn), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(default), Times.Never);
        }
    }
}