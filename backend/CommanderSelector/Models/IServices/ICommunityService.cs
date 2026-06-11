using CommanderSelector.Models;

namespace CommanderSelector.Models.IServices;

public interface ICommunityService
{
    IEnumerable<Tag> GetUserTags(int userId);
    IEnumerable<CommunityEntry> GetCommandersByTag(int userId, int tagId, string? bracket);
    IEnumerable<UserSummary> GetMembersByTag(int userId, int tagId);
    IEnumerable<GroupDrawEntry> DrawForGroup(int requesterId, int tagId, string bracket, int excludeCount, List<int> playerIds);
    void RecordGroupResult(int requesterId, int winnerUserId, List<int> playerIds, List<int> playIds);
}
