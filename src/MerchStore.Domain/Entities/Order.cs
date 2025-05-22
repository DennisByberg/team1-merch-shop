using MerchStore.Domain.Common;
using MerchStore.Domain.Enums;
using MerchStore.Domain.ValueObjects;

namespace MerchStore.Domain.Entities;

public class Order : Entity<Guid>
{
    // public Guid Id { get; private set; } = Guid.NewGuid();
    // Tog bort Id eftersom den ärvs från Entity<Guid>
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Street { get; private set; } = string.Empty;
    public string PostalCode { get; private set; } = string.Empty;
    public string City { get; private set; } = string.Empty;
    public string Country { get; private set; } = string.Empty;
    public OrderStatus OrderStatus { get; private set; } = OrderStatus.Pending;
    public ICollection<OrderProducts> OrderProducts { get; set; } = [];

    // Add properties to fix repository errors
    public string CustomerName
    {
        get => FullName; // Alias for FullName
        set => FullName = value;
    }

    public DateTime OrderDate { get; set; }



    private Order()
    {
        OrderDate = DateTime.UtcNow;
    } // Privat parameterlös konstruktor för EF Core

    public Order(
        string fullName,
        string email,
        string street,
        string postalCode,
        string city,
        string country,
        OrderStatus orderStatus,
        ICollection<OrderProducts> products
    ) : base(Guid.NewGuid())
    {
        ValidateFullName(fullName);
        ValidateStreet(street);
        ValidateProducts(products);
        ValidateEmail(email);
        ValidateCity(city);
        ValidatePostalCode(postalCode);
        ValidateCountry(country);

        FullName = fullName;
        Email = email;
        Street = street;
        PostalCode = postalCode;
        City = city;
        Country = country;
        OrderStatus = orderStatus;
        OrderProducts = products;
    }

    // Constructor for updates with existing ID
    public Order(
        Guid id,
        string fullName,
        string email,
        string street,
        string postalCode,
        string city,
        string country,
        OrderStatus orderStatus,
        ICollection<OrderProducts> products
    ) : base(id)
    {
        ValidateFullName(fullName);
        ValidateStreet(street);
        ValidateProducts(products);
        ValidateEmail(email);
        ValidateCity(city);
        ValidatePostalCode(postalCode);
        ValidateCountry(country);

        FullName = fullName;
        Email = email;
        Street = street;
        PostalCode = postalCode;
        City = city;
        Country = country;
        OrderStatus = orderStatus;
        OrderProducts = products;
    }

    public void UpdateCustomerInfo(string fullName, string email, string street, string postalCode, string city, string country)
    {
        // Validera all input innan uppdatering
        ValidateFullName(fullName);
        ValidateEmail(email);
        ValidateStreet(street);
        ValidatePostalCode(postalCode);
        ValidateCity(city);
        ValidateCountry(country);

        // Uppdatera properties först efter validering
        FullName = fullName;
        Email = email;
        Street = street;
        PostalCode = postalCode;
        City = city;
        Country = country;
    }

    public void UpdateStatus(OrderStatus status)
    {
        OrderStatus = status;
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

    private void ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email cannot be empty", nameof(email));
        }

        if (!email.Contains("@"))
        {
            throw new ArgumentException("Email must contain '@'", nameof(email));
        }
    }
    private void ValidateCity(string city)
    {
        if (string.IsNullOrWhiteSpace(city))
        {
            throw new ArgumentException("City cannot be empty", nameof(city));
        }

        if (city.Length < 2)
        {
            throw new ArgumentException("City must be at least 2 characters long", nameof(city));
        }
    }
    private void ValidatePostalCode(string postalCode)
    {
        if (string.IsNullOrWhiteSpace(postalCode))
        {
            throw new ArgumentException("Postal code cannot be empty", nameof(postalCode));
        }

        if (postalCode.Length < 5)
        {
            throw new ArgumentException("Postal code must be at least 5 characters long", nameof(postalCode));
        }
    }
    private void ValidateCountry(string country)
    {
        if (string.IsNullOrWhiteSpace(country))
        {
            throw new ArgumentException("Country cannot be empty", nameof(country));
        }

        if (country.Length < 2)
        {
            throw new ArgumentException("Country must be at least 2 characters long", nameof(country));
        }
    }
    private void ValidateStreet(string street)
    {
        if (string.IsNullOrWhiteSpace(street))
        {
            throw new ArgumentException("Street cannot be empty", nameof(street));
        }

        if (street.Length < 5)
        {
            throw new ArgumentException("Street must be at least 5 characters long", nameof(street));
        }
    }

    private void ValidateFullName(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName))
        {
            throw new ArgumentException("Customer name cannot be empty", nameof(fullName));
        }

        if (fullName.Length < 3)
        {
            throw new ArgumentException("Customer name must be at least 3 characters long", nameof(fullName));
        }
    }
}
