namespace CommanderSelector.Models.IServices;

public interface IPlayService
{
    /// <summary>
    /// Records the specified play instance for processing or storage.
    /// </summary>
    /// <remarks>Ensure that the play instance is valid and fully populated before calling this method. The
    /// method does not return a value.</remarks>
    /// <param name="play">The play instance to record. This object must contain all required information about the play and cannot be
    /// null.</param>
    public void RecordPlay(Play play);
}