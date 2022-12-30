using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using E_HealthCareApp_FSDProject.Controllers.Services.UserService;
using E_HealthCareApp_FSDProject.Data;
using E_HealthCareApp_FSDProject.DTOs;
using E_HealthCareApp_FSDProject.Models;
using System.Security.Claims;

namespace E_HealthCareApp_FSDProject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IUserService _userService;
        public AccountController(DataContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet("getAllUsers")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<Account>>> GetAllAccounts()
        {
            return Ok(await _context.Accounts.ToListAsync());
        }

        [HttpGet("getUser")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Account>> GetAccountById()
        {
            var userId = int.Parse(_userService.GetMyId());
            var account = await _context.Accounts.FindAsync(userId);
            if (account == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Account not found." }));
            }

            return Ok(account);
        }

        [HttpPost("editOwnAccount")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Account>> EditOwnAccount(EditDto newAccount)
        {
            var userId = _userService.GetMyId();

            if (newAccount.GetType().GetProperties()
                .Where(p => p.PropertyType == typeof(string))
                .Select(p => (string)p.GetValue(newAccount))
                .Any(value => value.Equals("string") || value.Equals("")))
            {
                return BadRequest();
            }

            if (userId == null)
                return BadRequest(JsonConvert.SerializeObject(new { message = "UserId not found." }));

            var oldAccount = await _context.Accounts.FindAsync(int.Parse(userId));
            if (oldAccount == null)
                return BadRequest(JsonConvert.SerializeObject(new { message = "Account not found." }));

            oldAccount.FirstName = newAccount.FirstName;
            oldAccount.LastName = newAccount.LastName;
            oldAccount.DateOfBirth = newAccount.DateOfBirth;
            oldAccount.Phone = newAccount.Phone;
            oldAccount.Address = newAccount.Address;
            oldAccount.Funds = newAccount.Funds;

            _context.Entry(oldAccount).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(oldAccount);
        }

        [HttpDelete("deleteAccount/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<Account>>> DeleteAccountById(int id)
        {
            var dbAccount = await _context.Accounts.FindAsync(id);
            if (dbAccount == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Account not found" }));
            }

            _context.Accounts.Remove(dbAccount);
            await _context.SaveChangesAsync();

            return Ok(await _context.Accounts.ToListAsync());
        }
    }
}
