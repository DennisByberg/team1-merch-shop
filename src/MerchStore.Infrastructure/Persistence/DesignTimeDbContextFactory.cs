
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MerchStore.Infrastructure.Persistence;

namespace MerchStore.Infrastructure.Persistence;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

        // 🔐 Connection string – använd din lokala eller Azure connection här
        var connectionString = "Server=tcp:merchstoreserver.database.windows.net,1433;Initial Catalog=merchstoreDB;Persist Security Info=False;User ID=merchstoreadmin;Password=MerchStore123;Encrypt=True;";

        optionsBuilder.UseSqlServer(connectionString);

        return new AppDbContext(optionsBuilder.Options);
    }
}
