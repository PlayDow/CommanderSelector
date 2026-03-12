namespace CommanderSelector.Models.IRepositories;

public interface IPlayRepository
{
    /// <summary>
    /// Inserts a new play record into the database using the specified play information.
    /// </summary>
    /// <remarks>The play is recorded with the current timestamp as the play date. The method does not return
    /// a value and does not indicate whether the insertion was successful.</remarks>
    /// <param name="newPlay">The play object containing the commander and user identifiers for the new play entry. Cannot be null.</param>
    public void InsertPlay(Play newPlay);
}
