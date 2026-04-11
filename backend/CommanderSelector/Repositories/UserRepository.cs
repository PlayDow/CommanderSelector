using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class UserRepository(IConfiguration configuration) : BaseRepository(configuration), IUserRepository
{
    public User? GetUserByUsername(string username)
    {
        var sql = @"SELECT * FROM ""Users"" WHERE ""UserName"" = @username";
        return Db.QuerySingleOrDefault<User>(sql, new { username });
    }

    public void CreateUser(User user)
    {
        var sql = @"INSERT INTO ""Users"" (""UserName"", ""Password"", ""RecoveryCodeHash"") 
                    VALUES (@UserName, @Password, @RecoveryCodeHash)";
        Db.Execute(sql, user);
    }

    public void UpdatePassword(string username, string newPasswordHash)
    {
        var sql = @"UPDATE ""Users"" SET ""Password"" = @newPasswordHash WHERE ""UserName"" = @username";
        Db.Execute(sql, new { username, newPasswordHash });
    }

    public void UpdateRecoveryCode(string username, string newCodeHash)
    {
        var sql = @"UPDATE ""Users"" SET ""RecoveryCodeHash"" = @newCodeHash WHERE ""UserName"" = @username";
        Db.Execute(sql, new { username, newCodeHash });
    }
}
