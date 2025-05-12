using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;
using System.Net;

namespace ReviewApiFunction
{
    public class GetProductReviews(ILogger<GetProductReviews> logger)
    {
        private readonly ILogger<GetProductReviews> _logger = logger;
        private static readonly Random _random = new();
        private static readonly string[] _customerNames = ["Real John Doe", "Real Jane Smith", "Real Bob Johnson", "Real Alice Brown", "Real Charlie Davis"];
        private static readonly string[] _reviewTitles = ["Great product!", "Highly recommended", "Exceeded expectations", "Not bad", "Could be better"];
        private static readonly string[] _reviewContents = [
            "I've been using this for weeks and it's fantastic.",
            "Exactly what I was looking for. High quality.",
            "The product is decent but shipping took too long.",
            "Works as advertised, very happy with my purchase.",
            "Good value for the money, would buy again."
        ];

        [Function("GetProductReviews")]
        [OpenApiOperation(operationId: "GetProductReviews", tags: ["Reviews"], Summary = "Get product reviews", Description = "This retrieves all reviews for a specific product.")]
        [OpenApiParameter(name: "productId", In = ParameterLocation.Path, Required = true, Type = typeof(string), Summary = "The ID of the product to get reviews for", Description = "The product ID must be a valid GUID")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(ReviewResponse), Summary = "Successful operation", Description = "The product reviews were successfully retrieved")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.BadRequest, Summary = "Invalid product ID", Description = "The product ID format was invalid")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.InternalServerError, Summary = "Internal server error", Description = "An unexpected error occurred processing the request")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "products/{productId}/reviews")] HttpRequest req,
            string productId)
        {
            _logger.LogInformation("Processing request for product reviews.");

            try
            {
                if (!Guid.TryParse(productId, out Guid productGuid))
                {
                    return new BadRequestObjectResult(new { error = "Invalid product ID format. Must be a valid GUID." });
                }

                int reviewCount = _random.Next(0, 6);
                List<Review> reviews = GenerateRandomReviews(productId, reviewCount);

                double averageRating = reviews.Count != 0
                    ? Math.Round(reviews.Average(r => r.Rating), 1)
                    : 0;

                var response = new ReviewResponse
                {
                    Reviews = reviews,
                    Stats = new ReviewStats
                    {
                        ProductId = productId,
                        AverageRating = averageRating,
                        ReviewCount = reviewCount
                    }
                };

                await Task.Delay(300);
                return new OkObjectResult(response);
            }

            catch (Exception ex)
            {
                _logger.LogError($"Error processing request: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private static List<Review> GenerateRandomReviews(string productId, int count)
        {
            var reviews = new List<Review>();

            for (int i = 0; i < count; i++)
            {
                var createdAt = DateTime.UtcNow.AddDays(-_random.Next(1, 31));
                int rating = _random.Next(1, 101) switch
                {
                    var n when n <= 10 => 1,
                    var n when n <= 25 => 2,
                    var n when n <= 50 => 3,
                    var n when n <= 80 => 4,
                    _ => 5
                };

                reviews.Add(new Review
                {
                    Id = Guid.NewGuid().ToString(),
                    ProductId = productId,
                    CustomerName = _customerNames[_random.Next(_customerNames.Length)],
                    Title = _reviewTitles[_random.Next(_reviewTitles.Length)],
                    Content = _reviewContents[_random.Next(_reviewContents.Length)],
                    Rating = rating,
                    CreatedAt = createdAt,
                    Status = "approved"
                });
            }

            return [.. reviews.OrderByDescending(r => r.CreatedAt)];
        }
    }
}