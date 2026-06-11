using CommanderSelector.Models;

namespace CommanderSelector.Models.IRepositories;

public interface IPlayRepository
{
    void InsertPlay(Play play);
    void UpdateResult(int playId, int userId, string result);
    void VoidPlay(int playId, int userId);
    IEnumerable<PlayDetail> GetHistory(int userId);
    IEnumerable<CommanderStats> GetStats(int userId);
}
