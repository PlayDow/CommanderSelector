using CommanderSelector.Models.IRepositories;
using CommanderSelector.Repositories;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Ajoute les services pour les contrôleurs
builder.Services.AddControllers();

// Service


// Repository
builder.Services.AddScoped<ICommanderRepository, CommanderRepository>();

// Le nouveau moteur OpenAPI de Microsoft
builder.Services.AddOpenApi();

var app = builder.Build();

// Configuration du pipeline
if (app.Environment.IsDevelopment())
{
    // Génère le point de terminaison JSON (/openapi/v1.json)
    app.MapOpenApi();

    // Active l'interface visuelle Scalar (alternative moderne à Swagger)
    // Accessible via http://localhost:5000/scalar/v1
    app.MapScalarApiReference();
}

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();