using CommanderSelector.Models;
using CommanderSelector.Models.IServices;
using CommanderSelector.Repositories;

namespace CommanderSelector.Services;

public class PlayService(PlayRepository playRepository) : IPlayService
{
    private readonly PlayRepository _playRepository = playRepository;

    /// <summary>
    /// Records a new play by persisting the specified play data to the repository.
    /// </summary>
    /// <remarks>Ensure that the play object is fully initialized before calling this method. The method
    /// persists the play to the underlying storage for later retrieval or analysis.</remarks>
    /// <param name="play">The play to record. This parameter must not be null.</param>
    public void RecordPlay(Play play)
    {
        _playRepository.InsertPlay(play);
    }
}