using System.ComponentModel.Design;

namespace CommanderSelector.Models;

public class ResetPassword
{
    /// <summary>
    /// Gets or sets the unique identifier for the administrator.
    /// </summary>
    public int AdminId { get; set; }

    /// <summary>
    /// Gets or sets the username associated with the current user or session.
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the new password to be set for the user.
    /// </summary>
    public string NewPassword { get; set; } = string.Empty;
}