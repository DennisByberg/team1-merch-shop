using MerchStore.Domain.Entities;

namespace MerchStore.Application.Services.Interfaces;

public interface IOrderService
{
    /// <summary>
    /// Retrieves all orders in the system.
    /// /// </summary>
    /// <returns>A collection of all orders.</returns>
    Task<IEnumerable<Order>> GetAllOrdersAsync();

    /// <summary>
    /// Retrieves an order by its unique identifier.
    /// /// </summary>
    /// <param name="id">The order ID.</param>
    /// <returns>The order if found, null otherwise.</returns>
    Task<Order?> GetOrderByIdAsync(Guid id);
}