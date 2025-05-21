namespace MerchStore.WebApi.Models.Dtos.Orders

{
    public class OrderCreateDto
    {
        
        public List<OrderProductDto> OrderProducts { get; set; }

        // Kundinformation
        public string FullName { get; set; }
        public string Email { get; set; }

        // Leveransadress
        public string Street { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
    }
}
    
