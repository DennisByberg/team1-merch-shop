using MerchStore.Application.Common.Interfaces;
using MerchStore.Domain.Entities;
using MerchStore.Domain.Interfaces;

namespace MerchStore.Infrastructure.Persistence.Repositories;

public class RepositoryManager : IRepositoryManager
{
    private readonly IProductRepository _productRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Constructor that accepts all required repositories and the unit of work
    /// </summary>
    /// <param name="productRepository">The product repository</param>
    /// <param name="orderRepository">The order repository</param>
    /// <param name="unitOfWork">The unit of work</param>
    public RepositoryManager(IProductRepository productRepository, IOrderRepository orderRepository, IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }

    public IProductRepository ProductRepository => _productRepository; // Expose the product repository
    public IOrderRepository OrderRepository => _orderRepository; // Expose the order repository
    public IUnitOfWork UnitOfWork => _unitOfWork; // Expose the unit of work
    public Task SaveAsync()
    {
        return _unitOfWork.SaveAsync(); // Call the save method on the unit of work
    }

    public Task<Order?> GetByIdAsync(Guid orderId)
    {
        return _orderRepository.GetByIdAsync(orderId); // Call the get by ID method on the order repository
    }

    public Task UpdateAsync(Order order)
    {
        return _orderRepository.UpdateAsync(order); // Call the update method on the order repository
    }
}