using CommanderSelector.Models.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService userService, ICommunityService communityService) : ControllerBase
{
    private int GetUserId() =>
        Request.Headers.TryGetValue("X-User-Id", out var v) && int.TryParse(v, out var id) ? id : 0;

    [HttpPost("register")]
    public IActionResult Register([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { Message = "Pseudo et mot de passe requis." });
        try
        {
            var code = userService.Register(req.Username, req.Password);
            return Ok(new { Message = "Compte créé !", RecoveryCode = code });
        }
        catch (InvalidOperationException ex) { return Conflict(new { Message = ex.Message }); }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var user = userService.Login(req.Username, req.Password);
        if (user == null) return Unauthorized(new { Message = "Pseudo ou mot de passe incorrect." });

        // Récupère les tags pour le frontend
        var tags = communityService.GetUserTags(user.Id).Select(t => new { t.Id, t.Name });
        return Ok(new { UserId = user.Id, Username = user.UserName, IsAdmin = user.IsAdmin, Tags = tags });
    }

    [HttpPost("recover")]
    public IActionResult Recover([FromBody] RecoverRequest req)
    {
        var newCode = userService.ResetWithCode(req.Username, req.RecoveryCode, req.NewPassword);
        if (newCode == null) return BadRequest(new { Message = "Pseudo ou code incorrect." });
        return Ok(new { Message = "Mot de passe réinitialisé.", NewRecoveryCode = newCode });
    }
}

public record LoginRequest(string Username, string Password);
public record RecoverRequest(string Username, string RecoveryCode, string NewPassword);
