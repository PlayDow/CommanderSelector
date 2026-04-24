namespace CommanderSelector.Models;

public class Play
{
    /// <summary>
    /// Gets or sets the unique identifier for the entity.
    /// </summary>
    public int Id { get; set; }
    /// <summary>
    /// Gets or sets the unique identifier for the commander associated with this entity.
    /// </summary>
    public int CommanderId { get; set; }
    /// <summary>
    /// Gets or sets the unique identifier for the user.
    /// </summary>
    public int UserId { get; set; }
    /// <summary>
    /// Gets or sets the date and time when the event was played, represented in Coordinated Universal Time (UTC).
    /// </summary>
    /// <remarks>This property is initialized to the current UTC date and time when a new instance is
    /// created.</remarks>
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
}