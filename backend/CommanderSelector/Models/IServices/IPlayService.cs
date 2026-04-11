using CommanderSelector.Models;
using CommanderSelector.Models.Dto;

namespace CommanderSelector.Models.IServices;

public interface IPlayService
{
    void RecordPlay(Play play);
    IEnumerable<PlayHistoryDto> GetHistory(int userId);
}
