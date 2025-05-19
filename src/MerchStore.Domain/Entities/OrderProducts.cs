using MerchStore.Domain.ValueObjects;

namespace MerchStore.Domain.Entities;

public class OrderProducts
{
        public Guid Id { get; set; }
        public Guid OrderId { get; set; } // FK → Order
        public Order Order { get; set; } = null!;
        public Guid ProductId { get; set; } // FK → Product
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
        public Money UnitPrice { get; set; } = Money.FromSEK(0);
}