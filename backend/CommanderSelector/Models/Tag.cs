using System.ComponentModel.DataAnnotations.Schema;

namespace CommanderSelector.Models;

public class Tag
{
    [Column("ID")]
    public int Id { get; set; }

    [Column("Name")]
    public string Name { get; set; } = string.Empty;
}
