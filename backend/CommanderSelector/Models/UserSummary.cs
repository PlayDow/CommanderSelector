namespace CommanderSelector.Models;

public class UserSummary
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public List<TagSummary> Tags { get; set; } = [];
}

public class TagSummary
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class GroupDrawEntry
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int? CommanderId { get; set; }
    public string CommanderName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Bracket { get; set; } = string.Empty;
    public int? PlayId { get; set; }
}
