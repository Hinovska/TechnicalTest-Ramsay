using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Ramsay.WebApp.Authentication;
using System.Net;


namespace Ramsay.WebApp.Controllers
{
    [Authorize]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class HealthCheckController : ControllerBase
    {
        private IConfiguration _config;
        private readonly ILogger<HealthCheckController> _logger;
        private readonly IJwtAuthenticationManager _jwtAuthenticationManager;

        public HealthCheckController(IJwtAuthenticationManager jwtAuthenticationManager, ILogger<HealthCheckController> logger, IConfiguration config)
        {
            _config = config;
            _logger = logger;
            _jwtAuthenticationManager = jwtAuthenticationManager;
        }

        // GET: api/v1/<HealthCheckController>
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Get()
        {
            APIEntities.OperationAPI<string[]> objResponse = new APIEntities.OperationAPI<string[]>();
            objResponse.Data = new string[] { "ApiStatus", "OK" };
            objResponse.Message = "It Works!";
            objResponse.StatusCode = HttpStatusCode.OK.ToString();
            return Ok(objResponse);
        }

        // GET: api/v1/<HealthCheckController>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Authenticate([FromBody] APIAuthUser userCredentials)
        {
            APIEntities.OperationAPI<string> objResponse = new APIEntities.OperationAPI<string>();
            if (userCredentials == null || userCredentials == new APIAuthUser())
                return BadRequest();

            string token = _jwtAuthenticationManager.Authenticate(userCredentials.UserName, userCredentials.Password);
            if (token == null)
                return Unauthorized();

            objResponse.Data = token;
            objResponse.Message = "Token generated";
            objResponse.StatusCode = HttpStatusCode.OK.ToString();
            return Ok(objResponse);
        }
    }
}
