using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class CommunityRepository(IConfiguration configuration) : BaseRepository(configuration), ICommunityRepository
{
    public IEnumerable<CommunityEntry> GetCommandersByTag(int tagId, string? bracket)
    {
        var sql = @"
            SELECT
                u.""UserName""  AS UserName,
                u.""ID""        AS UserId,
                c.""ID""        AS CommanderId,
                c.""Name""      AS CommanderName,
                c.""ImageUrl""  AS ImageUrl,
                c.""Bracket""   AS Bracket,
                c.""IsActive""  AS IsActive
            FROM ""Commanders"" c
            JOIN ""Users"" u ON u.""ID"" = c.""UserId""
            JOIN ""UserTags"" ut ON ut.""UserId"" = u.""ID""
            WHERE ut.""TagId"" = @tagId
            AND (@bracket IS NULL OR c.""Bracket"" = @bracket)
            ORDER BY u.""UserName"", c.""Bracket"", c.""Name""";
        return Db.Query<CommunityEntry>(sql, new { tagId, bracket });
    }

    public IEnumerable<UserSummary> GetMembersByTag(int tagId)
    {
        var sql = @"
            SELECT u.""ID"" AS Id, u.""UserName"", u.""IsAdmin""
            FROM ""Users"" u
            JOIN ""UserTags"" ut ON ut.""UserId"" = u.""ID""
            WHERE ut.""TagId"" = @tagId
            ORDER BY u.""UserName""";
        return Db.Query<UserSummary>(sql, new { tagId });
    }
}
