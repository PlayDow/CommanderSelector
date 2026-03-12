namespace CommanderSelector.Models;

public class Commander
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid ScryfallId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int Bracket { get; set; }
}