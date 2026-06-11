using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;

namespace CommanderSelector.Services;

public class UserService(IUserRepository repository) : IUserService
{
    public string Register(string username, string password)
    {
        if (repository.GetUserByUsername(username) != null)
            throw new InvalidOperationException("Ce pseudo est déjà pris.");
        var code = GenerateCode();
        repository.CreateUser(new User
        {
            UserName = username,
            Password = BCrypt.Net.BCrypt.HashPassword(password),
            RecoveryCodeHash = BCrypt.Net.BCrypt.HashPassword(code)
        });
        return code;
    }

    public User? Login(string username, string password)
    {
        var user = repository.GetUserByUsername(username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password)) return null;
        return user;
    }

    public string? ResetWithCode(string username, string recoveryCode, string newPassword)
    {
        var user = repository.GetUserByUsername(username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(recoveryCode, user.RecoveryCodeHash)) return null;
        repository.UpdatePassword(username, BCrypt.Net.BCrypt.HashPassword(newPassword));
        var newCode = GenerateCode();
        repository.UpdateRecoveryCode(username, BCrypt.Net.BCrypt.HashPassword(newCode));
        return newCode;
    }

    private static string GenerateCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var rng = new Random();
        return new string(Enumerable.Range(0, 8).Select(_ => chars[rng.Next(chars.Length)]).ToArray());
    }
}
