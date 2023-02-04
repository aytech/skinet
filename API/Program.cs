using API.Extensions;
using API.Helpers;
using API.Middleware;
using AutoMapper;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions();

// Add services to the container.
builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(options => options.UseSqlite("name=ConnectionStrings:DefaultConnection"));
builder.Services.AddDbContext<AppIdentityDbContext>(options =>
{
    options.UseSqlite("name=ConnectionStrings:IdentityConnection");
});
builder.Services.AddSingleton<IConnectionMultiplexer>(c =>
{
    return ConnectionMultiplexer.Connect(builder.Configuration.GetValue<string>("ConnectionStrings:Redis"));
});
builder.Services.AddApplicationServices();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AppPolicy", policy =>
    {
        policy.WithOrigins("https://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();
    try
    {
        var context = services.GetRequiredService<StoreContext>();
        await context.Database.MigrateAsync();
        await StoreContextSeed.SeedAsync(context, loggerFactory);
    }
    catch (System.Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An error occured during migration");
    }
}

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseHttpsRedirection();

app.UseRouting();
app.UseStaticFiles();

app.UseCors("AppPolicy");

app.UseAuthorization();

app.UseSwaggerDocumentation();

app.MapControllers();

app.Run();
