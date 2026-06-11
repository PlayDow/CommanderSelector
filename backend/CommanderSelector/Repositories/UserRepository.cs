using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class UserRepository(IConfiguration configuration) : BaseRepository(configuration), IUserRepository
{
    public User? GetUserByUsername(string username) =>
        Db.QuerySingleOrDefault<User>(@"SELECT * FROM ""Users"" WHERE ""UserName"" = @username", new { username });

    public User? GetUserById(int id) =>
        Db.QuerySingleOrDefault<User>(@"SELECT * FROM ""Users"" WHERE ""ID"" = @id", new { id });

    public void CreateUser(User user) =>
        Db.Execute(@"
            INSERT INTO ""Users"" (""UserName"", ""Password"", ""RecoveryCodeHash"")
            VALUES (@UserName, @Password, @RecoveryCodeHash)", user);

    public void UpdatePassword(string username, string newPasswordHash) =>
        Db.Execute(@"UPDATE ""Users"" SET ""Password"" = @newPasswordHash WHERE ""UserName"" = @username",
            new { username, newPasswordHash });

    public void UpdateRecoveryCode(string username, string newCodeHash) =>
        Db.Execute(@"UPDATE ""Users"" SET ""RecoveryCodeHash"" = @newCodeHash WHERE ""UserName"" = @username",
            new { username, newCodeHash });

    public void SetAdminFlag(int userId, bool isAdmin) =>
        Db.Execute(@"UPDATE ""Users"" SET ""IsAdmin"" = @isAdmin WHERE ""ID"" = @userId",
            new { userId, isAdmin });

    public IEnumerable<UserSummary> GetAllUsers() =>
        Db.Query<UserSummary>(@"SELECT ""ID"" AS Id, ""UserName"", ""IsAdmin"" FROM ""Users"" ORDER BY ""ID""");
}
