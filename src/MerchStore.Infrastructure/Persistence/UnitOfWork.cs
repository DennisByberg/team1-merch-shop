using MerchStore.Application.Common.Interfaces;

namespace MerchStore.Infrastructure.Persistence;

// Unit of Work-mönstret ger ett sätt att gruppera flera databasoperationer
// i en och samma transaktion, så att antingen allt lyckas eller allt misslyckas tillsammans.
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    // Sparar alla ändringar som gjorts i context till databasen, returnerar antal påverkade entiteter
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    // Startar ny transaction
    public async Task BeginTransactionAsync()
    {
        await _context.Database.BeginTransactionAsync();
    }

    // Bekräftar (commits) alla ändringar som gjorts i den aktuella transaktionen
    public async Task CommitTransactionAsync()
    {
        await _context.Database.CommitTransactionAsync();
    }

    // Ångrar (roll backs) alla ändringar som gjorts i den aktuella transaktionen
    public async Task RollbackTransactionAsync()
    {
        await _context.Database.RollbackTransactionAsync();
    }
}