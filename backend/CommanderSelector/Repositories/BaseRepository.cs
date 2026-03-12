using System.Data;
using Npgsql;

namespace CommanderSelector.Repositories;

public abstract class BaseRepository(IConfiguration configuration)
{
    private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Connection string not found.");

    protected IDbConnection Db => new NpgsqlConnection(_connectionString);
}