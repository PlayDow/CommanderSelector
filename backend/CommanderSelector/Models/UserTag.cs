using System.ComponentModel.DataAnnotations.Schema;

namespace CommanderSelector.Models;

public class UserTag
{
    [Column("ID")]
    public int Id { get; set; }

    [Column("UserId")]
    public int UserId { get; set; }

    [Column("TagId")]
    public int TagId { get; set; }
}
