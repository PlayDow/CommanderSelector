namespace CommanderSelector.Models;

public class Play
{
    public int Id { get; set; }
    public int CommanderId { get; set; }
    public int UserId { get; set; }
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
}