using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using E_HealthCareApp_FSDProject.Controllers.Services.TokenManager;
using E_HealthCareApp_FSDProject.Controllers.Services.UserService;
using E_HealthCareApp_FSDProject.Data;
using E_HealthCareApp_FSDProject.DTOs;
using E_HealthCareApp_FSDProject.Models;

namespace E_HealthCareApp_FSDProject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IUserService _userService;
        private readonly ITokenManager _tokenManager;
        public string JwtToken = string.Empty;

        public AuthController(DataContext context, IUserService userService, ITokenManager tokenManager)
        {
            _context = context;
            _userService = userService;
            _tokenManager = tokenManager;
        }

        [HttpGet("GetMe")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Account>> GetMe()
        {
            string? userId = _userService.GetMyId();
            string? userName = _userService.GetMyName();
            string? userRole = _userService.GetMyRole();
            if(userId == null)
                return BadRequest(JsonConvert.SerializeObject(new { message = "Not logged in" }));

            var account = await _context.Accounts.FindAsync(int.Parse(userId));
            if(account == null)
                return BadRequest(JsonConvert.SerializeObject(new { message = "User does not exist." }));

            return account;
        }

        [HttpPost("register")]
        public async Task<ActionResult<Account>> Register(RegisterDto request)
        {
            var (passwordHash, passwordSalt) = _tokenManager.CreatePasswordHash(request.Password);

            if (!await _tokenManager.VerifyEmail(request.Email))
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "User already exists." }));
            }

            if(request.FirstName == null || request.LastName == null ||
                request.Email == null || request.Password == null ||
                request.DateOfBirth == null || request.Phone == null ||
                request.Address == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Invalid input." }));
            }

            var account = new Account
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                DateOfBirth = request.DateOfBirth,
                Phone = request.Phone,
                Address = request.Address,
                Funds = 1000,
                Admin = request.Admin
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return Ok(account);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto request)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(x => x.Email == request.Email);

            if (account == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "User does not exist." }));
            }

            if (account.Email != request.Email)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "User not found." }));
            }

            if (!_tokenManager.VerifyPasswordHash(request.Password, account.PasswordHash, account.PasswordSalt))
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Wrong password." }));
            }

            JwtToken = _tokenManager.CreateToken(account);
            var json = JsonConvert.SerializeObject(new { token = JwtToken });

            return Ok(json);
        }
    }
}
