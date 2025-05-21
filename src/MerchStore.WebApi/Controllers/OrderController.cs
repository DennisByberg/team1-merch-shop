using Microsoft.AspNetCore.Mvc;
using MerchStore.Application.Services.Interfaces;
using MerchStore.WebApi.Models.Dtos.Orders;
using Microsoft.AspNetCore.Authorization;
using OpenIddict.Validation.AspNetCore;

namespace MerchStore.WebApi.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize(Policy = "ApiKeyPolicy")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var orders = await _orderService.GetAllOrdersAsync();
            var orderDtos = orders.Select(MapToDto);
            return Ok(orderDtos);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Title = "Internal Server Error",
                    Detail = "An error occurred while retrieving orders.",
                    Status = StatusCodes.Status500InternalServerError
                });
        }
    }

    // Helper method to map domain entity to DTO.
    private static OrderDto MapToDto(Domain.Entities.Order order) => new()
    {
        Id = order.Id,
        FullName = order.FullName,
        Email = order.Email,
        Street = order.Street,
        PostalCode = order.PostalCode,
        City = order.City,
        Country = order.Country,
        OrderStatus = order.OrderStatus,
        OrderProducts = order.OrderProducts.Select(orderProduct => new OrderProductDto
        {
            ProductId = orderProduct.ProductId,
            ProductName = orderProduct.Product.Name,
            Quantity = orderProduct.Quantity,
            UnitPrice = orderProduct.UnitPrice.Amount
        }).ToList()
    };
}