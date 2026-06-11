using System.ComponentModel.DataAnnotations.Schema;

namespace CommanderSelector.Models;

public class Commander
{
    [Column("ID")]
    public int Id { get; set; }

    [Column("UserId")]
    public int UserId { get; set; }

    [Column("Name")]
    public string Name { get; set; } = string.Empty;

    [Column("ScryfallId")]
    public string ScryfallId { get; set; } = string.Empty;

    [Column("ImageUrl")]
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>Valeurs : "1", "2", "3Fa", "3Fo", "4", "5"</summary>
    [Column("Bracket")]
    public string Bracket { get; set; } = "3Fa";

    [Column("IsActive")]
    public bool IsActive { get; set; } = true;
}