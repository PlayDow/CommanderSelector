using CommanderSelector.Models;

namespace CommanderSelector.Models.IRepositories;

public interface IUserRepository
{
    User? GetUserByUsername(string username);
    User? GetUserById(int id);
    void CreateUser(User user);
    void UpdatePassword(string username, string newPasswordHash);
    void UpdateRecoveryCode(string username, string newCodeHash);
    void SetAdminFlag(int userId, bool isAdmin);
    IEnumerable<UserSummary> GetAllUsers();
}
