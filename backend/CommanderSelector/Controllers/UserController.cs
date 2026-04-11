using CommanderSelector.Models;
using CommanderSelector.Models.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    /// <summary>Inscription : pseudo + mot de passe. Retourne le code de récupération à noter.</summary>
    [HttpPost("register")]
    public IActionResult Register([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { Message = "Pseudo et mot de passe requis." });

        try
        {
            var recoveryCode = _userService.Register(request.Username, request.Password);
            return Ok(new { Message = "Compte créé !", RecoveryCode = recoveryCode });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
    }

    /// <summary>Connexion. Retourne l'userId si succès.</summary>
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _userService.Login(request.Username, request.Password);
        if (user == null)
            return Unauthorized(new { Message = "Pseudo ou mot de passe incorrect." });

        return Ok(new { UserId = user.Id, Username = user.UserName });
    }

    /// <summary>Réinitialisation via code de récupération. Retourne un nouveau code à noter.</summary>
    [HttpPost("recover")]
    public IActionResult Recover([FromBody] RecoverRequest request)
    {
        var newCode = _userService.ResetWithCode(request.Username, request.RecoveryCode, request.NewPassword);
        if (newCode == null)
            return BadRequest(new { Message = "Pseudo ou code de récupération incorrect." });

        return Ok(new { Message = "Mot de passe réinitialisé.", NewRecoveryCode = newCode });
    }
}

public record LoginRequest(string Username, string Password);
public record RecoverRequest(string Username, string RecoveryCode, string NewPassword);
