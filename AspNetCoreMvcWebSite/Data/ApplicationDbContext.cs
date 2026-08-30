using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AspNetCoreMvcWebSite.Models;

namespace AspNetCoreMvcWebSite.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

public DbSet<AspNetCoreMvcWebSite.Models.AIImage> AIImages { get; set; } = default!;
}
