using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class PlayRepository(IConfiguration configuration) : BaseRepository(configuration), IPlayRepository
{
    /// <summary>
    /// Inserts a new play record into the database using the specified play information.
    /// </summary>
    /// <remarks>The play is recorded with the current timestamp as the play date. The method does not return
    /// a value and does not indicate whether the insertion was successful.</remarks>
    /// <param name="newPlay">The play object containing the commander and user identifiers for the new play entry. Cannot be null.</param>
    public void InsertPlay(Play newPlay)
    {
        var sql = @"
        INSERT INTO ""Plays"" (""CommanderId"", ""UserId"", ""PlayedAt"")
        VALUES (@CommanderId, @UserId, CURRENT_TIMESTAMP)";

        Db.Execute(sql, newPlay);
    }
}