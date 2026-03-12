using System.ComponentModel.Design;

namespace CommanderSelector.Models;

public class User
{
    /// <summary>
    /// Gets or sets the unique identifier for the entity.
    /// </summary>
    public int Id { get; set; }
    /// <summary>
    /// Gets or sets the username associated with the account.
    /// </summary>
    /// <remarks>The username is used for authentication and identification purposes within the application.
    /// It should be unique and not exceed 50 characters in length.</remarks>
    public string UserName { get; set; } = string.Empty;
    /// <summary>
    /// Gets or sets the password associated with the user account.
    /// </summary>
    /// <remarks>Ensure that the password value meets the application's security requirements, such as minimum
    /// length and complexity, before assigning it to this property. Storing plain text passwords is not recommended;
    /// consider using secure password handling and storage practices.</remarks>
    public string Password { get; set; } = string.Empty;
}