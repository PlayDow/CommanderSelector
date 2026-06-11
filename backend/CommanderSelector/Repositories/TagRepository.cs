using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class TagRepository(IConfiguration configuration) : BaseRepository(configuration), ITagRepository
{
    public IEnumerable<Tag> GetAllTags() =>
        Db.Query<Tag>(@"SELECT ""ID"" AS Id, ""Name"" FROM ""Tags"" ORDER BY ""Name""");

    public Tag? GetTagById(int id) =>
        Db.QuerySingleOrDefault<Tag>(@"SELECT ""ID"" AS Id, ""Name"" FROM ""Tags"" WHERE ""ID"" = @id", new { id });

    public void CreateTag(string name) =>
        Db.Execute(@"INSERT INTO ""Tags"" (""Name"") VALUES (@name)", new { name });

    public void DeleteTag(int id) =>
        Db.Execute(@"DELETE FROM ""Tags"" WHERE ""ID"" = @id", new { id });

    public void AssignTag(int userId, int tagId) =>
        Db.Execute(@"
            INSERT INTO ""UserTags"" (""UserId"", ""TagId"")
            VALUES (@userId, @tagId)
            ON CONFLICT (""UserId"", ""TagId"") DO NOTHING",
            new { userId, tagId });

    public void RemoveTag(int userId, int tagId) =>
        Db.Execute(@"DELETE FROM ""UserTags"" WHERE ""UserId"" = @userId AND ""TagId"" = @tagId",
            new { userId, tagId });

    public IEnumerable<Tag> GetUserTags(int userId)
    {
        var sql = @"
            SELECT t.""ID"" AS Id, t.""Name""
            FROM ""Tags"" t
            JOIN ""UserTags"" ut ON ut.""TagId"" = t.""ID""
            WHERE ut.""UserId"" = @userId
            ORDER BY t.""Name""";
        return Db.Query<Tag>(sql, new { userId });
    }

    public IEnumerable<int> GetUserIdsByTag(int tagId) =>
        Db.Query<int>(@"SELECT ""UserId"" FROM ""UserTags"" WHERE ""TagId"" = @tagId", new { tagId });
}
