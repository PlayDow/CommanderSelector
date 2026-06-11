using CommanderSelector.Models;

namespace CommanderSelector.Models.IRepositories;

public interface ITagRepository
{
    IEnumerable<Tag> GetAllTags();
    Tag? GetTagById(int id);
    void CreateTag(string name);
    void DeleteTag(int id);
    void AssignTag(int userId, int tagId);
    void RemoveTag(int userId, int tagId);
    IEnumerable<Tag> GetUserTags(int userId);
    IEnumerable<int> GetUserIdsByTag(int tagId);
}
