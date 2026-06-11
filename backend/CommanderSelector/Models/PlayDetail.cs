namespace CommanderSelector.Models;

public class PlayDetail
{
    public int Id { get; set; }
    public int CommanderId { get; set; }
    public string CommanderName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Bracket { get; set; } = string.Empty;
    public DateTime PlayedAt { get; set; }
    public string? Result { get; set; }
    public bool IsVoided { get; set; }
}
