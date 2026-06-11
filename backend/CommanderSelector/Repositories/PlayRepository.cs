using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class PlayRepository(IConfiguration configuration) : BaseRepository(configuration), IPlayRepository
{
    public void InsertPlay(Play play)
    {
        Db.Execute(@"
            INSERT INTO ""Plays"" (""CommanderId"", ""UserId"", ""PlayedAt"")
            VALUES (@CommanderId, @UserId, CURRENT_TIMESTAMP)", play);
    }

    public void UpdateResult(int playId, int userId, string result)
    {
        Db.Execute(@"
            UPDATE ""Plays"" SET ""Result"" = @result
            WHERE ""ID"" = @playId AND ""UserId"" = @userId",
            new { playId, userId, result });
    }

    public void VoidPlay(int playId, int userId)
    {
        Db.Execute(@"
            UPDATE ""Plays"" SET ""IsVoided"" = TRUE
            WHERE ""ID"" = @playId AND ""UserId"" = @userId",
            new { playId, userId });
    }

    public IEnumerable<PlayDetail> GetHistory(int userId)
    {
        var sql = @"
            SELECT
                p.""ID""          AS Id,
                p.""CommanderId"" AS CommanderId,
                c.""Name""        AS CommanderName,
                c.""ImageUrl""    AS ImageUrl,
                c.""Bracket""     AS Bracket,
                p.""PlayedAt""    AS PlayedAt,
                p.""Result""      AS Result,
                p.""IsVoided""    AS IsVoided
            FROM ""Plays"" p
            JOIN ""Commanders"" c ON c.""ID"" = p.""CommanderId""
            WHERE p.""UserId"" = @userId
            ORDER BY p.""PlayedAt"" DESC";
        return Db.Query<PlayDetail>(sql, new { userId });
    }

    public IEnumerable<CommanderStats> GetStats(int userId)
    {
        var sql = @"
            SELECT
                c.""ID""       AS CommanderId,
                c.""Name""     AS CommanderName,
                c.""ImageUrl"" AS ImageUrl,
                c.""Bracket""  AS Bracket,
                COUNT(p.""ID"")                                        AS TotalGames,
                COUNT(p.""ID"") FILTER (WHERE p.""Result"" = 'win')   AS Wins,
                COUNT(p.""ID"") FILTER (WHERE p.""Result"" = 'loss')  AS Losses
            FROM ""Commanders"" c
            LEFT JOIN ""Plays"" p ON p.""CommanderId"" = c.""ID""
                AND p.""UserId"" = @userId
                AND p.""IsVoided"" = FALSE
            WHERE c.""UserId"" = @userId
            GROUP BY c.""ID"", c.""Name"", c.""ImageUrl"", c.""Bracket""
            HAVING COUNT(p.""ID"") > 0
            ORDER BY c.""Bracket"", c.""Name""";
        return Db.Query<CommanderStats>(sql, new { userId });
    }
}
