using CommanderSelector.Models;
using CommanderSelector.Models.IRepositories;
using Dapper;

namespace CommanderSelector.Repositories;

public class UserRepository(IConfiguration configuration) : BaseRepository(configuration), IUserRepository
{

}