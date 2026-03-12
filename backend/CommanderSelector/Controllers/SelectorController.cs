using CommanderSelector.Models;
using CommanderSelector.Models.IServices;
using CommanderSelector.Services;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers;

/// <summary>
/// Initializes a new instance of the CommanderController class using the specified commander service.
/// </summary>
/// <param name="commanderService">The service that provides commander-related operations. This parameter must not be null.</param>
[ApiController]
[Route("api/[controller]")]
public class CommanderController(
    ICommanderService commanderService,
    IPlayService playService
    ) : ControllerBase
{
    private readonly ICommanderService _commanderService = commanderService;
    private readonly IPlayService _playService = playService;
    private const int TemporaryUserId = 1; // TO DO

    /// <summary>
    /// Retrieves a list of user commanders filtered by the specified bracket, if provided.
    /// </summary>
    /// <remarks>This endpoint requires authentication and is accessible via an HTTP GET request to the 'lib'
    /// route.</remarks>
    /// <param name="bracket">An optional bracket identifier used to filter the list of commanders. If null, all commanders associated with
    /// the user are returned.</param>
    /// <returns>An IActionResult containing a collection of user commanders. Returns an empty collection if no commanders are
    /// found.</returns>
    [HttpGet("lib")]
    public IActionResult GetUserCommanders([FromQuery] int? bracket)
    {
        var commanders = _commanderService.GetUserCommanders(TemporaryUserId, bracket);
        return Ok(commanders);
    }

    /// <summary>
    /// Retrieves a collection of playable items filtered by the specified bracket and the number of items to exclude.
    /// </summary>
    /// <remarks>Use this method to obtain a dynamic set of playable items for a user, typically in accordance
    /// with game rules or user progression.</remarks>
    /// <param name="bracket">The bracket level used to filter the playable items. Must be a positive integer.</param>
    /// <param name="excludeCount">The number of items to exclude from the playable pool. Must be a non-negative integer.</param>
    /// <returns>An IActionResult containing the filtered pool of playable items. Returns an empty collection if no items are
    /// available based on the specified criteria.</returns>
    [HttpGet("roulette")]
    public IActionResult GetPlayablePool([FromQuery] int bracket, [FromQuery] int excludeCount)
    {
        var pool = _commanderService.GetPlayablePool(TemporaryUserId, bracket, excludeCount);
        return Ok(pool);
    }

    /// <summary>
    /// Creates a new commander and associates it with the current user.
    /// </summary>
    /// <remarks>The UserId of the new commander is automatically set to the temporary user ID before the
    /// commander is added. Use this method to register a new commander for the current user.</remarks>
    /// <param name="newCommander">The commander to add. Must contain valid commander data in the request body.</param>
    /// <returns>A 201 Created result containing the newly created commander and a location header referencing the resource.</returns>
    [HttpPost]
    public IActionResult AddCommander([FromBody] Commander newCommander)
    {
        newCommander.UserId = TemporaryUserId;  // TO DO
        _commanderService.AddCommander(newCommander);
        return CreatedAtAction(nameof(GetUserCommanders), new { bracket = newCommander.Bracket }, newCommander);
    }

    /// <summary>
    /// Updates the specified commander with the provided information.
    /// </summary>
    /// <remarks>The UserId property of the commander is set to a temporary user ID before the update is
    /// processed. Ensure that the commander object is properly populated before calling this method.</remarks>
    /// <param name="commander">The commander object containing the updated details. The object must include all required properties for a valid
    /// update.</param>
    /// <returns>An IActionResult that indicates the result of the update operation. Returns NoContent if the update is
    /// successful.</returns>
    [HttpPut]
    public IActionResult UpdateCommander([FromBody] Commander commander)
    {
        commander.UserId = TemporaryUserId;  // TO DO
        _commanderService.UpdateCommander(commander);
        return NoContent();
    }

    /// <summary>
    /// Deletes the commander with the specified identifier.
    /// </summary>
    /// <remarks>An exception is thrown if the specified identifier does not match an existing
    /// commander.</remarks>
    /// <param name="id">The unique identifier of the commander to delete. Must correspond to an existing commander.</param>
    /// <returns>An IActionResult that represents the result of the delete operation. Returns a NoContent result if the deletion
    /// is successful.</returns>
    [HttpDelete("{id}")]
    public IActionResult DeleteCommander(int id)
    {
        _commanderService.DeleteCommander(id, TemporaryUserId);
        return NoContent();
    }

    /// <summary>
    /// Records a play instance submitted by the client and associates it with a temporary user identifier.
    /// </summary>
    /// <remarks>This method assigns a temporary user ID to the play before recording it. Use this endpoint
    /// for scenarios where user authentication is not yet implemented or when testing play submissions.</remarks>
    /// <param name="play">The play object containing the details of the play to record. Must be properly populated before submission.</param>
    /// <returns>An IActionResult that indicates the result of the operation. Returns a success message if the play is recorded
    /// successfully.</returns>
    [HttpPost("record-play")]
    public IActionResult RecordPlay([FromBody] Play play)
    {
        play.UserId = 1; // TO DO
        _playService.RecordPlay(play);
        return Ok(new { Message = "Partie enregistrée" });
    }
}