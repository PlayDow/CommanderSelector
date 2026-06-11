using CommanderSelector.Models;

namespace CommanderSelector.Models.IServices;

public interface IUserService
{
    string Register(string username, string password);
    User? Login(string username, string password);
    string? ResetWithCode(string username, string recoveryCode, string newPassword);
}
