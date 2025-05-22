using Microsoft.AspNetCore.Mvc;
using MerchStore.Application.Services.Interfaces;
using MerchStore.WebApi.Models.Dtos.Orders;
using Microsoft.AspNetCore.Authorization;
using OpenIddict.Validation.AspNetCore;
using MerchStore.Domain.Entities;
using MerchStore.Domain.Enums;
using MerchStore.WebApi.Models.Dtos.Orders;
using MerchStore.WebApi.Models.Dtos;


namespace MerchStore.WebApi.Controllers;

[ApiController]
[Route("api/orders")]

public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ICatalogService _catalogService;

    public OrderController(IOrderService orderService, ICatalogService catalogService)
    {
        _orderService = orderService;
        _catalogService = catalogService;
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

    [HttpGet("{id:guid}")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Order Not Found",
                    Detail = $"Order with ID {id} was not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(MapToDto(order));
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Title = "Internal Server Error",
                    Detail = "An error occurred while retrieving the order.",
                    Status = StatusCodes.Status500InternalServerError
                });
        }
    }

    [HttpPost]
    [Authorize(Policy = "ApiKeyPolicy")]

    public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto orderCreateDto)
    {
        try
        {
            // Get products from catalog service to verify they exist and get prices
            var orderProducts = new List<OrderProducts>();

            foreach (var item in orderCreateDto.OrderProducts)
            {
                var product = await _catalogService.GetProductByIdAsync(item.ProductId);
                if (product == null)
                {
                    return BadRequest(new ProblemDetails
                    {
                        Title = "Invalid Product",
                        Detail = $"Product with ID {item.ProductId} does not exist.",
                        Status = StatusCodes.Status400BadRequest
                    });
                }

                orderProducts.Add(new OrderProducts
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                });
            }

            // Create order entity
            var order = new Domain.Entities.Order(
                orderCreateDto.FullName,
                orderCreateDto.Email,
                orderCreateDto.Street,
                orderCreateDto.PostalCode,
                orderCreateDto.City,
                orderCreateDto.Country,
                Domain.Enums.OrderStatus.Pending,
                orderProducts
            );

            // Save order
            var createdOrder = await _orderService.CreateOrderAsync(order);

            // Return created order
            return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, MapToDto(createdOrder));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid Order Data",
                Detail = ex.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Title = "Internal Server Error",
                    Detail = "An error occurred while creating the order.",
                    Status = StatusCodes.Status500InternalServerError
                });
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] OrderUpdateDto orderUpdateDto)
    {
        try
        {
            // Check if the order exists
            var existingOrder = await _orderService.GetOrderByIdAsync(id);
            if (existingOrder is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Order Not Found",
                    Detail = $"Order with ID {id} was not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            // Update only customer information
            existingOrder.UpdateCustomerInfo(
                orderUpdateDto.FullName,
                orderUpdateDto.Email,
                orderUpdateDto.Street,
                orderUpdateDto.PostalCode,
                orderUpdateDto.City,
                orderUpdateDto.Country
            );

            // Update order status if provided
            existingOrder.UpdateStatus(orderUpdateDto.OrderStatus);

            // Update the order
            var result = await _orderService.UpdateOrderAsync(id, existingOrder);

            // Check if update was successful
            if (result is null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new ProblemDetails
                    {
                        Title = "Update Failed",
                        Detail = "Failed to update the order.",
                        Status = StatusCodes.Status500InternalServerError
                    });
            }

            // Return the updated order
            return Ok(MapToDto(result));
        }
        // Handle specific exceptions
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid Order Data",
                Detail = ex.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
        // Handle other exceptions
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Title = "Internal Server Error",
                    Detail = ex.Message,
                    Status = StatusCodes.Status500InternalServerError
                });
        }
    }

    [HttpPost("{id:guid}/items/{itemId:guid}")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddItemToOrder(Guid id, Guid itemId, [FromBody] AddOrderItemDto? request = null)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Order Not Found",
                    Detail = $"Order with ID {id} was not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var product = await _catalogService.GetProductByIdAsync(itemId);
            if (product == null)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Product Not Found",
                    Detail = $"Product with ID {itemId} was not found.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            int quantity = request?.Quantity ?? 1;

            var result = await _orderService.AddProductToOrderAsync(id, itemId, quantity);
            if (result == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
                {
                    Title = "Failed to add product",
                    Detail = "Could not add the product to the order.",
                    Status = StatusCodes.Status500InternalServerError
                });
            }

            return Ok(MapToDto(result));
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Internal Error",
                Detail = ex.Message,
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



