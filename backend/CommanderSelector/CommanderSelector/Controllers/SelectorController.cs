using CommanderSelector.Models;
using Microsoft.AspNetCore.Mvc;

namespace CommanderSelector.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SelectorController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {

        }
    }
}
