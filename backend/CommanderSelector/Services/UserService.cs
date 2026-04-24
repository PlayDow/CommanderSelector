using BCrypt.Net;
using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;

namespace CommanderSelector.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    private readonly IUserRepository _userRepository = userRepository;

    public string Register(string username, string password)
    {
        if (_userRepository.GetUserByUsername(username) != null)
            throw new InvalidOperationException("Ce pseudo est déjà pris.");

        var recoveryCode = GenerateRecoveryCode();

        var user = new User
        {
            UserName = username,
            Password = BCrypt.Net.BCrypt.HashPassword(password),
            RecoveryCodeHash = BCrypt.Net.BCrypt.HashPassword(recoveryCode)
        };

        _userRepository.CreateUser(user);
        return recoveryCode; // Retourné en clair UNE SEULE FOIS
    }

    public User? Login(string username, string password)
    {
        var user = _userRepository.GetUserByUsername(username);
        if (user == null) return null;
        if (!BCrypt.Net.BCrypt.Verify(password, user.Password)) return null;
        return user;
    }

    public string? ResetWithCode(string username, string recoveryCode, string newPassword)
    {
        var user = _userRepository.GetUserByUsername(username);
        if (user == null) return null;
        if (!BCrypt.Net.BCrypt.Verify(recoveryCode, user.RecoveryCodeHash)) return null;

        // Nouveau mot de passe
        _userRepository.UpdatePassword(username, BCrypt.Net.BCrypt.HashPassword(newPassword));

        // Nouveau code de récupération (l'ancien ne fonctionne plus)
        var newCode = GenerateRecoveryCode();
        _userRepository.UpdateRecoveryCode(username, BCrypt.Net.BCrypt.HashPassword(newCode));

        return newCode;
    }

    private static string GenerateRecoveryCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O/1/I pour éviter confusion
        var random = new Random();
        return new string(Enumerable.Range(0, 8).Select(_ => chars[random.Next(chars.Length)]).ToArray());
    }
}
