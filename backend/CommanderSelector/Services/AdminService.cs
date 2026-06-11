using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;

namespace CommanderSelector.Services;

public class AdminService(IUserRepository userRepo, ITagRepository tagRepo) : IAdminService
{
    private void AssertAdmin(int requesterId)
    {
        var user = userRepo.GetUserById(requesterId);
        if (user == null || !user.IsAdmin) throw new UnauthorizedAccessException();
    }

    public IEnumerable<UserSummary> GetAllUsers(int requesterId)
    {
        AssertAdmin(requesterId);
        var users = userRepo.GetAllUsers().ToList();
        foreach (var u in users)
            u.Tags = tagRepo.GetUserTags(u.Id).Select(t => new TagSummary { Id = t.Id, Name = t.Name }).ToList();
        return users;
    }

    public void SetAdminFlag(int requesterId, int targetId, bool isAdmin)
    {
        AssertAdmin(requesterId);
        userRepo.SetAdminFlag(targetId, isAdmin);
    }

    public IEnumerable<Tag> GetAllTags(int requesterId)
    {
        AssertAdmin(requesterId);
        return tagRepo.GetAllTags();
    }

    public void CreateTag(int requesterId, string name)
    {
        AssertAdmin(requesterId);
        tagRepo.CreateTag(name);
    }

    public void DeleteTag(int requesterId, int tagId)
    {
        AssertAdmin(requesterId);
        tagRepo.DeleteTag(tagId);
    }

    public void AssignTag(int requesterId, int userId, int tagId)
    {
        AssertAdmin(requesterId);
        tagRepo.AssignTag(userId, tagId);
    }

    public void RemoveTag(int requesterId, int userId, int tagId)
    {
        AssertAdmin(requesterId);
        tagRepo.RemoveTag(userId, tagId);
    }
}
