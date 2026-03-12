using CommanderSelector.Models;
using CommanderSelector.Models.IServices;
using CommanderSelector.Services;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UserController(
    IUserService userService
    ) : ControllerBase
{

}