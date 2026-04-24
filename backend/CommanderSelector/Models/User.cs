namespace CommanderSelector.Models;

public class User
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    /// <summary>Hash BCrypt du code de récupération (jamais exposé en clair en dehors de l'inscription)</summary>
    public string RecoveryCodeHash { get; set; } = string.Empty;
}
