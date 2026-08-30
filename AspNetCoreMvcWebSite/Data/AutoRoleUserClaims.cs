using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AspNetCoreMvcWebSite.Data
{
    public class AutoRoleUserClaims : UserClaimsPrincipalFactory<IdentityUser, IdentityRole>
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AutoRoleUserClaims(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, roleManager, optionsAccessor)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public override async Task<ClaimsPrincipal> CreateAsync(IdentityUser user)
        {
            if (!await _roleManager.RoleExistsAsync("User"))
                await _roleManager.CreateAsync(new IdentityRole("User"));

            var roles = await _userManager.GetRolesAsync(user);
            if (roles == null || roles.Count == 0)
                await _userManager.AddToRoleAsync(user, "User");

            return await base.CreateAsync(user);
        }
    }
}
