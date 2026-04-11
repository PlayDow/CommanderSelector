using CommanderSelector.Models;

namespace CommanderSelector.Models.IServices;

public interface IUserService
{
    /// <summary>Crée un compte. Retourne le code de récupération à afficher une seule fois.</summary>
    string Register(string username, string password);

    /// <summary>Authentifie. Retourne l'utilisateur ou null si échec.</summary>
    User? Login(string username, string password);

    /// <summary>Réinitialise le mot de passe avec le code de récupération. Retourne un nouveau code.</summary>
    string? ResetWithCode(string username, string recoveryCode, string newPassword);
}
