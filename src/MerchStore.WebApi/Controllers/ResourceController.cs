using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Validation.AspNetCore;
using static OpenIddict.Abstractions.OpenIddictConstants;
// denna är tillfällig och kommer senare raderas, den är till för att checka så systemet fungerar tills vi fixar de med frontend
namespace MerchStore.WebApi.Controllers;
// Definierar en API-kontroller med routen "api"
[Route("api")]
public class ResourceController : Controller
{
    private readonly IOpenIddictApplicationManager _applicationManager;
        
    public ResourceController(IOpenIddictApplicationManager applicationManager)
        => _applicationManager = applicationManager; 
    // Skyddad GET-endpoint som endast kan nås av autentiserade klienter via OpenIddict
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    [HttpGet("message")]
    public async Task<IActionResult> GetMessage()
    {
        // hämtar ClientID från autentiseringstoken
        using ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole());
        ILogger logger = factory.CreateLogger("hej");
        var subject = User.FindFirst(Claims.Subject)?.Value;
        if (string.IsNullOrEmpty(subject))
        {
            // om ingen ClientID hittas, returnera BadRequest
            return BadRequest();
        }
// försöker hämta applikationen med ClientID
        var application = await _applicationManager.FindByClientIdAsync(subject);
        if (application == null)
        {
            // Om ingen applikation hittas, returneras också ett BadRequest
            return BadRequest();
        }
// om vi lyckas med alla steg så returneras en bekräftelsemeddelande
logger.LogInformation("Authenticated");
        return Content($"{await _applicationManager.GetDisplayNameAsync(application)} has been successfully authenticated.");
    }
}