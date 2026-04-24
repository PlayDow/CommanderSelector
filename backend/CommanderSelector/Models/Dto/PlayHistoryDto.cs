namespace CommanderSelector.Models.Dto;

public class PlayHistoryDto
{
    public int Id { get; set; }
    public int CommanderId { get; set; }
    public string CommanderName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int Bracket { get; set; }
    public DateTime PlayedAt { get; set; }
}
