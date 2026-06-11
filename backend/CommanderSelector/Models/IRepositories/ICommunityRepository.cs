using CommanderSelector.Models;

namespace CommanderSelector.Models.IRepositories;

public interface ICommunityRepository
{
    IEnumerable<CommunityEntry> GetCommandersByTag(int tagId, string? bracket);
    IEnumerable<UserSummary> GetMembersByTag(int tagId);
}
