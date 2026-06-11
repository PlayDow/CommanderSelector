namespace CommanderSelector.Models.IServices;

public interface ICommanderService
{
    void AddCommander(Commander newCommander);
    void UpdateCommander(Commander commander);
    void DeleteCommander(int id, int userId);
    void ToggleActive(int id, int userId);
    IEnumerable<Commander> GetUserCommanders(int userId, string? bracket);
    IEnumerable<Commander> GetPlayablePool(int userId, string bracket, int excludeCount);
}