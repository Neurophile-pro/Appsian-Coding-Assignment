using backend.DTOs.Auth;

namespace backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> Register(RegisterDto registerDto);
        Task<AuthResponseDto> Login(LoginDto loginDto);
        string GenerateJwtToken(Guid userId, string username);
    }
}
