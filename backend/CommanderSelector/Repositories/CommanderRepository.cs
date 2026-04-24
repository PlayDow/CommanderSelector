using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class CommanderRepository(IConfiguration configuration) :
    BaseRepository(configuration), ICommanderRepository
{
    /// <summary>
    /// Inserts a new commander record into the database using the specified commander details.
    /// </summary>
    /// <remarks>Ensure that all required properties of the commander object are populated before calling this method.
    /// This method does not return a value and does not indicate whether the insert operation was successful.</remarks>
    /// <param name="newCommander">An object containing the details of the commander to insert. Must include valid values for UserId, Name, ScryfallId,
    /// ImageUrl, and Bracket.</param>
    public void InsertCommander(Commander newCommander)
    {
        var sql = @"
            INSERT INTO ""Commanders"" (""UserId"", ""Name"", ""ScryfallId"", ""ImageUrl"", ""Bracket"")
            VALUES (@UserId, @Name, @ScryfallId, @ImageUrl, @Bracket)";

        Db.Execute(sql, newCommander);
    }

    /// <summary>
    /// Updates the details of an existing commander in the data store.
    /// </summary>
    /// <remarks>If no commander with the specified ID and UserId exists, no records are updated. Ensure that the
    /// commander object contains valid and complete data before calling this method.</remarks>
    /// <param name="commander">An object containing the updated commander information. The object's ID and UserId properties must identify the
    /// commander to update; Name, Bracket, and ImageUrl provide the new values.</param>
    public void UpdateCommander(Commander commander)
    {
        var sql = @"
            UPDATE ""Commanders"" 
            SET ""Name"" = @Name, ""Bracket"" = @Bracket, ""ImageUrl"" = @ImageUrl 
            WHERE ""ID"" = @Id AND ""UserId"" = @UserId";

        Db.Execute(sql, commander);
    }

    /// <summary>
    /// Deletes a commander from the data store using the specified commander identifier and user identifier.
    /// </summary>
    /// <remarks>If no commander matching both the specified identifier and user identifier exists, no action
    /// is taken. This method ensures that only the owner of a commander can delete it.</remarks>
    /// <param name="id">The unique identifier of the commander to delete. Must correspond to an existing commander.</param>
    /// <param name="userId">The identifier of the user requesting the deletion. Only commanders owned by this user can be deleted.</param>
    public void DeleteCommander(int id, int userId)
    {
        var sql = @"DELETE FROM ""Commanders"" WHERE ""ID"" = @id AND ""UserId"" = @userId";

        Db.Execute(sql, new { id, userId });
    }

    /// <summary>
    /// Retrieves a collection of commanders associated with the specified user, optionally filtered by bracket.
    /// </summary>
    /// <remarks>This method queries the data store for commanders linked to the specified user. If a bracket is
    /// provided, only commanders in that bracket are included in the results.</remarks>
    /// <param name="userId">The unique identifier of the user whose commanders are to be retrieved. This value must be a valid user ID.</param>
    /// <param name="bracket">An optional bracket value used to filter the commanders. If null, commanders from all brackets are returned.</param>
    /// <returns>An enumerable collection of <see cref="Commander"/> objects representing the user's commanders. The collection is
    /// empty if no commanders are found.</returns>
    public IEnumerable<Commander> GetUserCommanders(int userId, int? bracket = null)
    {
        var sql = @"
        SELECT * FROM ""Commanders"" 
        WHERE ""UserId"" = @userId 
        AND (@bracket IS NULL OR ""Bracket"" = @bracket)";

        return Db.Query<Commander>(sql, new { userId, bracket });
    }

    /// <summary>
    /// Retrieves a collection of commanders available for play by the specified user within the given bracket, excluding a
    /// specified number of commanders from the result.
    /// </summary>
    /// <remarks>Use this method to obtain a filtered list of playable commanders tailored to a user's bracket and
    /// exclusion preferences. The method ensures that the excluded count is respected, which can be useful for implementing
    /// custom selection or rotation logic.</remarks>
    /// <param name="userId">The unique identifier of the user for whom the playable commander pool is being retrieved.</param>
    /// <param name="bracket">The bracket level that determines the range of commanders eligible for selection.</param>
    /// <param name="excludeCount">The number of commanders to exclude from the returned collection. Must be zero or greater.</param>
    /// <returns>An enumerable collection of Commander objects representing the commanders available for selection by the user in the
    /// specified bracket, after exclusions are applied.</returns>
    public IEnumerable<Commander> GetPlayablePool(int userId, int bracket, int excludeCount)
    {
        var exclusionSql = excludeCount > 0
            ? $@"AND ""ID"" NOT IN (
                SELECT ""CommanderId"" 
                FROM ""Plays"" 
                WHERE ""UserId"" = @userId 
                ORDER BY ""PlayedAt"" DESC 
                LIMIT {excludeCount}
            )"
            : "";

        var sql = $@"
        SELECT * FROM ""Commanders"" 
        WHERE ""UserId"" = @userId 
        AND ""Bracket"" = @bracket
        {exclusionSql}";

        return Db.Query<Commander>(sql, new { userId, bracket });
    }
}