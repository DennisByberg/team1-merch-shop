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


    public void Update(Order existingOrder, Order updatedOrder)
    {
        // Update the existing order with the new values
        existingOrder.CustomerName = updatedOrder.CustomerName;
        existingOrder.OrderDate = updatedOrder.OrderDate;


        // Update the order products
        foreach (var orderProduct in updatedOrder.OrderProducts)
        {
            var existingOrderProduct = existingOrder.OrderProducts
                .FirstOrDefault(op => op.ProductId == orderProduct.ProductId);

            if (existingOrderProduct != null)
            {
                existingOrderProduct.Quantity = orderProduct.Quantity;
            }
            else
            {
                existingOrder.OrderProducts.Add(orderProduct);
            }
        }
    }

    public void Update(Order existingOrder)
    {
        // Update the existing order with the new values
        _context.Entry(existingOrder).State = EntityState.Modified;
    }
}