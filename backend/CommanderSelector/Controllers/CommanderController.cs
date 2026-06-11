using CommanderSelector.Models;
using CommanderSelector.Models.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommanderController(ICommanderService commanderService, IPlayService playService) : ControllerBase
{
    private int GetUserId() =>
        Request.Headers.TryGetValue("X-User-Id", out var v) && int.TryParse(v, out var id) ? id : 0;

    [HttpGet("lib")]
    public IActionResult GetLibrary([FromQuery] string? bracket)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        return Ok(commanderService.GetUserCommanders(uid, bracket));
    }

    [HttpGet("roulette")]
    public IActionResult GetPool([FromQuery] string bracket, [FromQuery] int excludeCount)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        return Ok(commanderService.GetPlayablePool(uid, bracket, excludeCount));
    }

    [HttpGet("history")]
    public IActionResult GetHistory()
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        return Ok(playService.GetHistory(uid));
    }

    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        return Ok(playService.GetStats(uid));
    }

    [HttpPost]
    public IActionResult Add([FromBody] Commander c)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        c.UserId = uid;
        commanderService.AddCommander(c);
        return Created("", c);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Commander c)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        c.Id = id; c.UserId = uid;
        commanderService.UpdateCommander(c);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        commanderService.DeleteCommander(id, uid);
        return NoContent();
    }

    [HttpPatch("{id}/toggle")]
    public IActionResult Toggle(int id)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        commanderService.ToggleActive(id, uid);
        return NoContent();
    }

    [HttpPost("record-play")]
    public IActionResult RecordPlay([FromBody] Play play)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        play.UserId = uid;
        playService.RecordPlay(play);
        return Ok(new { Message = "Partie enregistrée" });
    }

    [HttpPatch("play/{playId}/result")]
    public IActionResult UpdateResult(int playId, [FromBody] ResultRequest req)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        if (req.Result != "win" && req.Result != "loss")
            return BadRequest("Valeurs acceptées : 'win' ou 'loss'");
        playService.UpdateResult(playId, uid, req.Result);
        return NoContent();
    }

    [HttpPatch("play/{playId}/void")]
    public IActionResult VoidPlay(int playId)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        playService.VoidPlay(playId, uid);
        return NoContent();
    }
}

public record ResultRequest(string Result);
