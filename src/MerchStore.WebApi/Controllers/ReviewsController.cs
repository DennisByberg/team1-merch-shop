using Microsoft.AspNetCore.Mvc;
using MerchStore.Application.Services.Interfaces;
using MerchStore.WebApi.Models.Dtos;

namespace MerchStore.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetReviewsByProductId(Guid productId)
    {
        var reviews = await _reviewService.GetReviewsByProductIdAsync(productId);
        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ProductId = r.ProductId,
            CustomerName = r.CustomerName,
            Title = r.Title,
            Content = r.Content,
            Rating = r.Rating,
            CreatedAt = r.CreatedAt,
            Status = r.Status.ToString()
        });
        return Ok(reviewDtos);
    }

    [HttpGet("product/{productId}/average-rating")]
    public async Task<IActionResult> GetAverageRating(Guid productId)
    {
        var avg = await _reviewService.GetAverageRatingForProductAsync(productId);
        return Ok(avg);
    }

    [HttpGet("product/{productId}/count")]
    public async Task<IActionResult> GetReviewCount(Guid productId)
    {
        var count = await _reviewService.GetReviewCountForProductAsync(productId);
        return Ok(count);
    }
}