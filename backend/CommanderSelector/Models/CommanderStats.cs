namespace CommanderSelector.Models;

public class CommanderStats
{
    public int CommanderId { get; set; }
    public string CommanderName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Bracket { get; set; } = string.Empty;
    public int TotalGames { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public double WinRate => TotalGames > 0 ? Math.Round((double)Wins / TotalGames * 100, 1) : 0;
}
