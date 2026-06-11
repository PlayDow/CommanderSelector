using CommanderSelector.Models.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommunityController(ICommunityService communityService) : ControllerBase
{
    private int GetUserId() =>
        Request.Headers.TryGetValue("X-User-Id", out var v) && int.TryParse(v, out var id) ? id : 0;

    [HttpGet("my-tags")]
    public IActionResult GetMyTags()
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        return Ok(communityService.GetUserTags(uid));
    }

    [HttpGet("{tagId}/commanders")]
    public IActionResult GetCommanders(int tagId, [FromQuery] string? bracket)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        try { return Ok(communityService.GetCommandersByTag(uid, tagId, bracket)); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpGet("{tagId}/members")]
    public IActionResult GetMembers(int tagId)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        try { return Ok(communityService.GetMembersByTag(uid, tagId)); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpPost("{tagId}/draw")]
    public IActionResult Draw(int tagId, [FromBody] GroupDrawRequest req)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        try { return Ok(communityService.DrawForGroup(uid, tagId, req.Bracket, req.ExcludeCount, req.PlayerIds)); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpPost("{tagId}/result")]
    public IActionResult RecordResult(int tagId, [FromBody] GroupResultRequest req)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        communityService.RecordGroupResult(uid, req.WinnerUserId, req.PlayerIds, req.PlayIds);
        return NoContent();
    }
}

public record GroupDrawRequest(string Bracket, int ExcludeCount, List<int> PlayerIds);
public record GroupResultRequest(int WinnerUserId, List<int> PlayerIds, List<int> PlayIds);
