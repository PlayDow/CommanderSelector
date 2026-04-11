using CommanderSelector.Models;
using CommanderSelector.Models.Dto;

namespace CommanderSelector.Models.IRepositories;

public interface IPlayRepository
{
    void InsertPlay(Play play);
    IEnumerable<PlayHistoryDto> GetHistory(int userId);
}
