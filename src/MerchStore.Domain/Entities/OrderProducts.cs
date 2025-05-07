using MerchStore.Domain.ValueObjects;

namespace MerchStore.Domain.Entities;

public class OrderProducts
{
    
        public Guid Id         { get; set; }

        // FK → Order
        public Guid OrderId    { get; set; }
        public Order Order     { get; set; } = null!;

        // FK → Product
        public Guid ProductId  { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity    { get; set; }
        public Money UnitPrice { get; set; }
}