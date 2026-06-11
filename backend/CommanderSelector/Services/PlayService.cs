using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;

namespace CommanderSelector.Services;

public class PlayService(IPlayRepository repository) : IPlayService
{
    public void RecordPlay(Play play) => repository.InsertPlay(play);
    public void UpdateResult(int playId, int userId, string result) => repository.UpdateResult(playId, userId, result);
    public void VoidPlay(int playId, int userId) => repository.VoidPlay(playId, userId);
    public IEnumerable<PlayDetail> GetHistory(int userId) => repository.GetHistory(userId);
    public IEnumerable<CommanderStats> GetStats(int userId) => repository.GetStats(userId);
}
