using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;

namespace CommanderSelector.Services;

public class CommunityService(
    ICommunityRepository communityRepo,
    ITagRepository tagRepo,
    ICommanderRepository commanderRepo,
    IPlayRepository playRepo) : ICommunityService
{
    private void AssertHasTag(int userId, int tagId)
    {
        var tags = tagRepo.GetUserTags(userId);
        if (!tags.Any(t => t.Id == tagId))
            throw new UnauthorizedAccessException("Accès refusé à ce groupe.");
    }

    public IEnumerable<Tag> GetUserTags(int userId) => tagRepo.GetUserTags(userId);

    public IEnumerable<CommunityEntry> GetCommandersByTag(int userId, int tagId, string? bracket)
    {
        AssertHasTag(userId, tagId);
        return communityRepo.GetCommandersByTag(tagId, bracket);
    }

    public IEnumerable<UserSummary> GetMembersByTag(int userId, int tagId)
    {
        AssertHasTag(userId, tagId);
        return communityRepo.GetMembersByTag(tagId);
    }

    public IEnumerable<GroupDrawEntry> DrawForGroup(int requesterId, int tagId, string bracket, int excludeCount, List<int> playerIds)
    {
        AssertHasTag(requesterId, tagId);
        var results = new List<GroupDrawEntry>();
        var members = communityRepo.GetMembersByTag(tagId).ToDictionary(m => m.Id);

        foreach (var playerId in playerIds)
        {
            var pool = commanderRepo.GetPlayablePool(playerId, bracket, excludeCount).ToList();
            if (pool.Count == 0)
                pool = commanderRepo.GetPlayablePool(playerId, bracket, 0).ToList();

            var entry = new GroupDrawEntry
            {
                UserId = playerId,
                UserName = members.TryGetValue(playerId, out var m) ? m.UserName : "?",
            };

            if (pool.Count > 0)
            {
                var picked = pool[new Random().Next(pool.Count)];
                entry.CommanderId = picked.Id;
                entry.CommanderName = picked.Name;
                entry.ImageUrl = picked.ImageUrl;
                entry.Bracket = picked.Bracket;

                var play = new Play { CommanderId = picked.Id, UserId = playerId };
                playRepo.InsertPlay(play);

                var history = playRepo.GetHistory(playerId).FirstOrDefault();
                entry.PlayId = history?.Id;
            }

            results.Add(entry);
        }

        return results;
    }

    public void RecordGroupResult(int requesterId, int winnerUserId, List<int> playerIds, List<int> playIds)
    {
        for (int i = 0; i < playerIds.Count && i < playIds.Count; i++)
        {
            var result = playerIds[i] == winnerUserId ? "win" : "loss";
            playRepo.UpdateResult(playIds[i], playerIds[i], result);
        }
    }
}
