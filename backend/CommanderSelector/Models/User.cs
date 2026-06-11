using System.ComponentModel.DataAnnotations.Schema;

namespace CommanderSelector.Models;

public class User
{
    [Column("ID")]
    public int Id { get; set; }

    [Column("UserName")]
    public string UserName { get; set; } = string.Empty;

    [Column("Password")]
    public string Password { get; set; } = string.Empty;

    [Column("RecoveryCodeHash")]
    public string RecoveryCodeHash { get; set; } = string.Empty;

    [Column("IsAdmin")]
    public bool IsAdmin { get; set; } = false;
}
