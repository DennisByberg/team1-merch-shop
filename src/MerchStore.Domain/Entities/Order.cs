using MerchStore.Domain.Common;

namespace MerchStore.Domain.Entities;

public class Order : Entity<Guid>
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string CustomerName { get; private set; } = string.Empty;
    public string ShippingAddress { get; private set; } = string.Empty;
    //public List<Product> Products { get; private set; } = new();
   public string OrderStatus { get; private set; } = string.Empty;
   public ICollection<OrderProducts> Product { get; set; } = new List<OrderProducts>();

    private Order()
    {
    } // Privat parameterlös konstruktor för EF Core
    public Order(string customerName, string shippingAddress, ICollection<OrderProducts> products) : base(Guid.NewGuid())
    {
        ValidateCustomerName(customerName);
        ValidateShippingAddress(shippingAddress);
        ValidateProducts(products);

        CustomerName = customerName;
        ShippingAddress = shippingAddress;
        Product = products;
    }

    private void ValidateProducts(ICollection<OrderProducts> products)
    {
        if (products == null || products.Count == 0)
        {
            throw new ArgumentException("Order must contain at least one product", nameof(products));
        }

        foreach (var product in products)
        {
            //if (product.StockQuantity <= 0)
            {
          //      throw new ArgumentException($"Product {product.Name} is out of stock", nameof(products));
            }
        }
    }

    private void ValidateShippingAddress(string shippingAddress)
    {
       if (string.IsNullOrWhiteSpace(shippingAddress))
        {
            throw new ArgumentException("Shipping address cannot be empty", nameof(shippingAddress));
        }

        if (shippingAddress.Length < 10)
        {
            throw new ArgumentException("Shipping address must be at least 10 characters long", nameof(shippingAddress));
        }
    }

    private void ValidateCustomerName(string customerName)
    {
        if (string.IsNullOrWhiteSpace(customerName))
        {
            throw new ArgumentException("Customer name cannot be empty", nameof(customerName));
        }

        if (customerName.Length < 3)
        {
            throw new ArgumentException("Customer name must be at least 3 characters long", nameof(customerName));
        }
    }
}