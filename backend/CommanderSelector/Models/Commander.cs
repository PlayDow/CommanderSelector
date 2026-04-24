namespace CommanderSelector.Models;

public class Commander
{
    /// <summary>
    /// Gets or sets the unique identifier for the entity.
    /// </summary>
    public int Id { get; set; }
    /// <summary>
    /// Gets or sets the unique identifier for the user.
    /// </summary>
    public int UserId { get; set; }
    /// <summary>
    /// Gets or sets the name associated with the current instance.
    /// </summary>
    /// <remarks>The name is initialized to an empty string. It can be modified to represent any valid string
    /// value as needed.</remarks>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Gets or sets the unique identifier for the card in the Scryfall database.
    /// </summary>
    /// <remarks>This identifier is used to reference the card across various Scryfall API endpoints. It is
    /// essential for ensuring accurate data retrieval and manipulation.</remarks>
    public Guid ScryfallId { get; set; }
    /// <summary>
    /// Gets or sets the URL of the image associated with the element.
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;
    /// <summary>
    /// Gets or sets the bracket value, which represents the current bracket level in a scoring system.
    /// </summary>
    public int Bracket { get; set; }
}