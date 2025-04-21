namespace MerchStore.Domain.ValueObjects;

public record Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        if (amount < 0)
        {
            throw new ArgumentException("Money Amount cannot be negative", nameof(amount));
        }

        if (string.IsNullOrWhiteSpace(currency))
        {
            throw new ArgumentException("Money Currency code must be 3 characters (ISO 4217 format)", nameof(currency));
        }

        if (currency.Length != 3)
        {
            throw new ArgumentException("Money Currency code must be 3 characters (ISO 4217 format)", nameof(currency));
        }

        Amount = amount;
        Currency = currency.ToUpper();
    }

    // Skapar ett Money-objekt med SEK som valuta (Static Factory Method design pattern)
    public static Money FromSEK(decimal amount)
    {
        return new Money(amount, "SEK");
    }

    // Summerar två Money-objekt (endast om de har samma valuta)
    public static Money operator +(Money left, Money right)
    {
        if (left.Currency != right.Currency)
            throw new InvalidOperationException("Cannot add money values with different currencies");

        return new Money(left.Amount + right.Amount, left.Currency);
    }

    // Multiplicerar Money med ett heltal (t.ex. antal produkter)
    public static Money operator *(Money money, int multiplier)
    {
        return new Money(money.Amount * multiplier, money.Currency);
    }

    // Multiplicerar Money med ett decimaltal (t.ex. procentsats eller rabatt)
    public static Money operator *(Money money, decimal multiplier)
    {
        if (multiplier < 0)
            throw new ArgumentException("Cannot multiply money by a negative value", nameof(multiplier));

        return new Money(money.Amount * multiplier, money.Currency);
    }

    // Möjliggör multiplikation där heltalet står först (t.ex. 3 * pris)
    public static Money operator *(int multiplier, Money money)
    {
        return money * multiplier;
    }

    // Möjliggör multiplikation där decimaltalet står först (t.ex. 0.5m * pris)
    public static Money operator *(decimal multiplier, Money money)
    {
        return money * multiplier;
    }

    // Returnerar en strängrepresentation av Money med två decimaler och valutakod (t.ex. "100.00 SEK")
    // Använder invariant culture för att undvika problem med olika decimaltecken i olika länder
    public override string ToString()
    {
        return $"{Amount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)} {Currency}";
    }
}