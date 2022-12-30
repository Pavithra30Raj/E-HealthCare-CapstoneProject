using E_HealthCareApp_FSDProject.Models;

namespace E_HealthCareApp_FSDProject.Controllers.Services.TokenManager
{
    public interface ITokenManager
    {
        (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password);
        string CreateToken(Account account);
        Task<bool> VerifyEmail(string email);
        bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt);
    }
}