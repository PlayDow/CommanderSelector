using System.ComponentModel.DataAnnotations.Schema;

namespace CommanderSelector.Models;

public class Play
{
    [Column("ID")]
    public int Id { get; set; }

    [Column("CommanderId")]
    public int CommanderId { get; set; }

    [Column("UserId")]
    public int UserId { get; set; }

    [Column("PlayedAt")]
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;

    /// <summary>"win" | "loss" | null</summary>
    [Column("Result")]
    public string? Result { get; set; }

    /// <summary>Annulé sans suppression — remet le deck dans la roulette</summary>
    [Column("IsVoided")]
    public bool IsVoided { get; set; } = false;
}
