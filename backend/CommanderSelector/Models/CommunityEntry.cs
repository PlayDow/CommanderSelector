namespace CommanderSelector.Models;

public class CommunityEntry
{
    public string UserName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public int CommanderId { get; set; }
    public string CommanderName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Bracket { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
