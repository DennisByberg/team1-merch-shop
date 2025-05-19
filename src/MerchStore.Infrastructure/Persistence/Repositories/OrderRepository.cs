using MerchStore.Domain.Entities;
using MerchStore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MerchStore.Infrastructure.Persistence.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    // Hämtar alla ordrar och inkluderar relaterade OrderProducts och Products
    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await _context.Orders
            .Include(order => order.OrderProducts)
            .ThenInclude(orderProduct => orderProduct.Product)
            .ToListAsync();
    }

    // Hämtar en order baserat på dess ID och inkluderar relaterade OrderProducts och Products
    public async Task<Order?> GetByIdAsync(Guid id)
    {
        return await _context.Orders
            .Include(order => order.OrderProducts)
            .ThenInclude(orderProduct => orderProduct.Product)
            .FirstOrDefaultAsync(order => order.Id == id);
    }

    // Hämtar en order baserat på dess ID och inkluderar relaterade OrderProducts och Products
    public async Task AddAsync(Order entity)
    {
        await _context.Orders.AddAsync(entity);
    }

    // Uppdaterar en befintlig order i databasen
    public async Task UpdateAsync(Order entity)
    {
        _context.Orders.Update(entity);
        await Task.CompletedTask;
    }

    // Tar bort en order från databasen
    public async Task RemoveAsync(Order entity)
    {
        _context.Orders.Remove(entity);
        await Task.CompletedTask;
    }
}