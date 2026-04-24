using CommanderSelector.Models;
using CommanderSelector.Models.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommanderController(
    ICommanderService commanderService,
    IPlayService playService
    ) : ControllerBase
{
    private readonly ICommanderService _commanderService = commanderService;
    private readonly IPlayService _playService = playService;

    /// <summary>Lit le userId depuis le header X-User-Id (envoyé par le frontend après login).</summary>
    private int GetUserId()
    {
        if (Request.Headers.TryGetValue("X-User-Id", out var value) && int.TryParse(value, out var id))
            return id;
        return 0;
    }

    [HttpGet("lib")]
    public IActionResult GetUserCommanders([FromQuery] int? bracket)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();
        return Ok(_commanderService.GetUserCommanders(userId, bracket));
    }

    [HttpGet("roulette")]
    public IActionResult GetPlayablePool([FromQuery] int bracket, [FromQuery] int excludeCount)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();
        return Ok(_commanderService.GetPlayablePool(userId, bracket, excludeCount));
    }

    [HttpGet("history")]
    public IActionResult GetHistory()
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();
        return Ok(_playService.GetHistory(userId));
    }

    [HttpPost]
    public IActionResult AddCommander([FromBody] Commander newCommander)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();
        newCommander.UserId = userId;
        _commanderService.AddCommander(newCommander);
        return CreatedAtAction(nameof(GetUserCommanders), new { bracket = newCommander.Bracket }, newCommander);
    }

    [HttpPut]
    public IActionResult UpdateCommander([FromBody] Commander commander)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();
        commander.UserId = userId;
        _commanderService.UpdateCommander(commander);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCommander(int id)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();
        _commanderService.DeleteCommander(id, userId);
        return NoContent();
    }

    [HttpPost("record-play")]
    public IActionResult RecordPlay([FromBody] Play play)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();
        play.UserId = userId;
        _playService.RecordPlay(play);
        return Ok(new { Message = "Partie enregistrée" });
    }
}
