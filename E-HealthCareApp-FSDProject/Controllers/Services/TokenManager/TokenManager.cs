using Microsoft.IdentityModel.Tokens;
using E_HealthCareApp_FSDProject.Controllers.Services.DateTimeService;
using E_HealthCareApp_FSDProject.Data;
using E_HealthCareApp_FSDProject.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace E_HealthCareApp_FSDProject.Controllers.Services.TokenManager
{
    public class TokenManager : ITokenManager
    {
        private readonly IConfiguration _configuration;
        private readonly IDateTimeProvider _dateTimeProvider;
        private readonly DataContext _context;

        public TokenManager(IDateTimeProvider dateTimeProvider, IConfiguration configuration, DataContext context)
        {
            _dateTimeProvider = dateTimeProvider;
            _configuration = configuration;
            _context = context;
        }

        public string CreateToken(Account account)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new Claim(ClaimTypes.Email, account.Email),
                new Claim(ClaimTypes.Role, account.Admin == 1 ? "Admin" : "User")
            };

            SymmetricSecurityKey? key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            SigningCredentials? creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            JwtSecurityToken? token = new JwtSecurityToken(
                claims: claims,
                expires: _dateTimeProvider.UtcNow().AddDays(1),
                signingCredentials: creds);

            string? jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        public bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (HMACSHA512? hmac = new HMACSHA512(passwordSalt))
            {
                byte[]? computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        public (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password)
        {
            using (HMACSHA512? hmac = new HMACSHA512())
            {
                var passwordSalt = hmac.Key;
                var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return (passwordHash, passwordSalt);
            }
        }

        public async Task<bool> VerifyEmail(string email)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(x => x.Email == email);
            return account == null;
        }
    }
}
