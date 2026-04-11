using CommanderSelector.Models;
using CommanderSelector.Models.Dto;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class PlayRepository(IConfiguration configuration) : BaseRepository(configuration), IPlayRepository
{
    public void InsertPlay(Play newPlay)
    {
        var sql = @"
        INSERT INTO ""Plays"" (""CommanderId"", ""UserId"", ""PlayedAt"")
        VALUES (@CommanderId, @UserId, CURRENT_TIMESTAMP)";
        Db.Execute(sql, newPlay);
    }

    public IEnumerable<PlayHistoryDto> GetHistory(int userId)
    {
        var sql = @"
        SELECT 
            p.""Id""           AS Id,
            p.""CommanderId""  AS CommanderId,
            c.""Name""         AS CommanderName,
            c.""ImageUrl""     AS ImageUrl,
            c.""Bracket""      AS Bracket,
            p.""PlayedAt""     AS PlayedAt
        FROM ""Plays"" p
        JOIN ""Commanders"" c ON c.""ID"" = p.""CommanderId""
        WHERE p.""UserId"" = @userId
        ORDER BY p.""PlayedAt"" DESC";

        return Db.Query<PlayHistoryDto>(sql, new { userId });
    }
}