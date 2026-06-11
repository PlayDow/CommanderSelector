using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class CommanderRepository(IConfiguration configuration) : BaseRepository(configuration), ICommanderRepository
{
    public void InsertCommander(Commander c)
    {
        var sql = @"
            INSERT INTO ""Commanders"" (""UserId"", ""Name"", ""ScryfallId"", ""ImageUrl"", ""Bracket"", ""IsActive"")
            VALUES (@UserId, @Name, @ScryfallId, @ImageUrl, @Bracket, TRUE)";
        Db.Execute(sql, c);
    }

    public void UpdateCommander(Commander c)
    {
        var sql = @"
            UPDATE ""Commanders""
            SET ""Name"" = @Name, ""Bracket"" = @Bracket, ""ImageUrl"" = @ImageUrl
            WHERE ""ID"" = @Id AND ""UserId"" = @UserId";
        Db.Execute(sql, c);
    }

    public void DeleteCommander(int id, int userId)
    {
        Db.Execute(@"DELETE FROM ""Commanders"" WHERE ""ID"" = @id AND ""UserId"" = @userId", new { id, userId });
    }

    public void ToggleActive(int id, int userId)
    {
        Db.Execute(@"
            UPDATE ""Commanders""
            SET ""IsActive"" = NOT ""IsActive""
            WHERE ""ID"" = @id AND ""UserId"" = @userId", new { id, userId });
    }

    public IEnumerable<Commander> GetUserCommanders(int userId, string? bracket = null)
    {
        var sql = @"
            SELECT * FROM ""Commanders""
            WHERE ""UserId"" = @userId
            AND (@bracket IS NULL OR ""Bracket"" = @bracket)
            ORDER BY ""IsActive"" DESC, ""Bracket"", ""Name""";
        return Db.Query<Commander>(sql, new { userId, bracket });
    }

    public IEnumerable<Commander> GetPlayablePool(int userId, string bracket, int excludeCount)
    {
        var exclusion = excludeCount > 0 ? $@"
            AND ""ID"" NOT IN (
                SELECT ""CommanderId"" FROM ""Plays""
                WHERE ""UserId"" = @userId
                ORDER BY ""PlayedAt"" DESC
                LIMIT {excludeCount}
            )" : "";

        var sql = $@"
            SELECT * FROM ""Commanders""
            WHERE ""UserId"" = @userId
            AND ""Bracket"" = @bracket
            AND ""IsActive"" = TRUE
            {exclusion}";
        return Db.Query<Commander>(sql, new { userId, bracket });
    }
}