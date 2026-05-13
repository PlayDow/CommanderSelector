using CommanderSelector.Models.IRepositories;
using CommanderSelector.Models.IServices;
using CommanderSelector.Repositories;
using CommanderSelector.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Repositories
builder.Services.AddScoped<ICommanderRepository, CommanderRepository>();
builder.Services.AddScoped<IPlayRepository, PlayRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services
builder.Services.AddScoped<ICommanderService, CommanderService>();
builder.Services.AddScoped<IPlayService, PlayService>();
builder.Services.AddScoped<IUserService, UserService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://commander-selector.pages.dev", 
                "https://cmdr-selector.yolle.net"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
