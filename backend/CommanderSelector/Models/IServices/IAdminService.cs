using CommanderSelector.Models;

namespace CommanderSelector.Models.IServices;

public interface IAdminService
{
    IEnumerable<UserSummary> GetAllUsers(int requesterId);
    void SetAdminFlag(int requesterId, int targetId, bool isAdmin);
    IEnumerable<Tag> GetAllTags(int requesterId);
    void CreateTag(int requesterId, string name);
    void DeleteTag(int requesterId, int tagId);
    void AssignTag(int requesterId, int userId, int tagId);
    void RemoveTag(int requesterId, int userId, int tagId);
}
