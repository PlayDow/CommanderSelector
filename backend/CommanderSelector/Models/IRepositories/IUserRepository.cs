using CommanderSelector.Models;

namespace CommanderSelector.Models.IRepositories;

public interface IUserRepository
{
    User? GetUserByUsername(string username);
    void CreateUser(User user);
    void UpdatePassword(string username, string newPasswordHash);
    void UpdateRecoveryCode(string username, string newCodeHash);
}
