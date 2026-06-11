using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;

namespace CommanderSelector.Services;

public class CommanderService(ICommanderRepository repository) : ICommanderService
{
    public void AddCommander(Commander c) => repository.InsertCommander(c);
    public void UpdateCommander(Commander c) => repository.UpdateCommander(c);
    public void DeleteCommander(int id, int userId) => repository.DeleteCommander(id, userId);
    public void ToggleActive(int id, int userId) => repository.ToggleActive(id, userId);
    public IEnumerable<Commander> GetUserCommanders(int userId, string? bracket) => repository.GetUserCommanders(userId, bracket);
    public IEnumerable<Commander> GetPlayablePool(int userId, string bracket, int excludeCount) => repository.GetPlayablePool(userId, bracket, excludeCount);
}
