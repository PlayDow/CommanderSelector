using CommanderSelector.Models;

namespace CommanderSelector.Models.IRepositories;

public interface ICommanderRepository
{
    void InsertCommander(Commander commander);
    void UpdateCommander(Commander commander);
    void DeleteCommander(int id, int userId);
    void ToggleActive(int id, int userId);
    IEnumerable<Commander> GetUserCommanders(int userId, string? bracket = null);
    IEnumerable<Commander> GetPlayablePool(int userId, string bracket, int excludeCount);
}