using MerchStore.Domain.Entities;
using MerchStore.Domain.Enums;

namespace MerchStore.WebApi.Models.Dtos.Orders;

public class OrderDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
    public decimal TotalOrderAmount => OrderProducts.Sum(op => op.TotalPrice);
    public string Currency => "SEK";
    public List<OrderProductDto> OrderProducts { get; set; }
}