using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;
using CommanderSelector.Repositories;

namespace CommanderSelector.Services;

public class CommanderService(ICommanderRepository commanderRepository) : ICommanderService
{
    private readonly ICommanderRepository _commanderRepository = commanderRepository;

    /// <summary>
    /// Adds a new commander to the repository.
    /// </summary>
    /// <param name="newCommander">The commander to add to the repository. Cannot be null.</param>
    public void AddCommander(Commander newCommander)
    {
        _commanderRepository.InsertCommander(newCommander);
    }

    /// <summary>
    /// Updates the information of an existing commander in the repository.
    /// </summary>
    /// <param name="commander">The commander object containing the updated data. Must not be null and should represent an existing commander.</param>
    public void UpdateCommander(Commander commander)
    {
        _commanderRepository.UpdateCommander(commander);
    }

    /// <summary>
    /// Deletes the commander with the specified identifier for the given user.
    /// </summary>
    /// <remarks>Ensure that the commander exists for the specified user before calling this method to avoid
    /// errors.</remarks>
    /// <param name="id">The unique identifier of the commander to delete. Must be greater than zero.</param>
    /// <param name="userId">The unique identifier of the user performing the deletion. Must be greater than zero.</param>
    public void DeleteCommander(int id, int userId)
    {
        _commanderRepository.DeleteCommander(id, userId);
    }

    /// <summary>
    /// Retrieves a collection of commanders associated with the specified user, optionally filtered by bracket.
    /// </summary>
    /// <param name="userId">The unique identifier of the user whose commanders are to be retrieved. Must be a positive integer.</param>
    /// <param name="bracket">An optional bracket identifier used to filter the commanders. If specified, only commanders within the given
    /// bracket are returned.</param>
    /// <returns>An enumerable collection of <see cref="Commander"/> objects representing the user's commanders. The collection
    /// is empty if no commanders are found.</returns>
    public IEnumerable<Commander> GetUserCommanders(int userId, int? bracket)
    {
        return _commanderRepository.GetUserCommanders(userId, bracket);
    }

    /// <summary>
    /// Retrieves a collection of playable commanders for a specified user and bracket, excluding a given number of
    /// entries from the pool.
    /// </summary>
    /// <remarks>This method queries the commander repository to obtain a filtered list of commanders based on
    /// the provided parameters. The excluded commanders are determined by the excludeCount parameter, which is useful
    /// for scenarios where previously selected commanders should not be included in the returned pool.</remarks>
    /// <param name="userId">The unique identifier of the user for whom the playable commander pool is being retrieved.</param>
    /// <param name="bracket">The bracket level that determines the range of commanders to include in the pool.</param>
    /// <param name="excludeCount">The number of commanders to exclude from the returned pool, typically used to skip already selected commanders.</param>
    /// <returns>An enumerable collection of Commander objects that are available for selection by the specified user within the
    /// given bracket.</returns>
    public IEnumerable<Commander> GetPlayablePool(int userId, int bracket, int excludeCount)
    {
        return _commanderRepository.GetPlayablePool(userId, bracket, excludeCount);
    }
}