using CommanderSelector.Models.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController(IAdminService adminService) : ControllerBase
{
    private int GetUserId() =>
        Request.Headers.TryGetValue("X-User-Id", out var v) && int.TryParse(v, out var id) ? id : 0;

    private IActionResult Guard(Action action)
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        try { action(); return NoContent(); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        try { return Ok(adminService.GetAllUsers(uid)); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpPatch("users/{targetId}/admin")]
    public IActionResult SetAdmin(int targetId, [FromBody] AdminFlagRequest req) =>
        Guard(() => adminService.SetAdminFlag(GetUserId(), targetId, req.IsAdmin));

    [HttpGet("tags")]
    public IActionResult GetTags()
    {
        var uid = GetUserId(); if (uid == 0) return Unauthorized();
        try { return Ok(adminService.GetAllTags(uid)); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpPost("tags")]
    public IActionResult CreateTag([FromBody] TagRequest req) =>
        Guard(() => adminService.CreateTag(GetUserId(), req.Name));

    [HttpDelete("tags/{tagId}")]
    public IActionResult DeleteTag(int tagId) =>
        Guard(() => adminService.DeleteTag(GetUserId(), tagId));

    [HttpPost("users/{userId}/tags/{tagId}")]
    public IActionResult AssignTag(int userId, int tagId) =>
        Guard(() => adminService.AssignTag(GetUserId(), userId, tagId));

    [HttpDelete("users/{userId}/tags/{tagId}")]
    public IActionResult RemoveTag(int userId, int tagId) =>
        Guard(() => adminService.RemoveTag(GetUserId(), userId, tagId));
}

public record AdminFlagRequest(bool IsAdmin);
public record TagRequest(string Name);
