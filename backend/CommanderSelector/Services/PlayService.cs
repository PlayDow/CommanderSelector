using CommanderSelector.Models;
using CommanderSelector.Models.Dto;
using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;

namespace CommanderSelector.Services;

public class PlayService(IPlayRepository playRepository) : IPlayService
{
    private readonly IPlayRepository _playRepository = playRepository;

    public void RecordPlay(Play play) => _playRepository.InsertPlay(play);

    public IEnumerable<PlayHistoryDto> GetHistory(int userId) => _playRepository.GetHistory(userId);
}
