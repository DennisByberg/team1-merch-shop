using Microsoft.EntityFrameworkCore;
using MerchStore.Domain.Common;
using MerchStore.Domain.Interfaces;

namespace MerchStore.Infrastructure.Persistence.Repositories;

public class Repository<TEntity, TId> : IRepository<TEntity, TId>
    where TEntity : Entity<TId>
    where TId : notnull
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<TEntity> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    // Hämtar en entitet baserat på dess ID, returnerar entiteten om den finns, annars null
    public virtual async Task<TEntity?> GetByIdAsync(TId id)
    {
        return await _dbSet.FindAsync(id);
    }

    // Hämtar alla entiteter av denna typ, returnerar en samling av alla entiteter
    public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    // Lägger till en ny entitet i databasen
    public virtual async Task AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
    }

    // Uppdaterar en befintlig entitet i databasen
    public virtual Task UpdateAsync(TEntity entity)
    {
        // Markerar entiteten som modifierad
        _context.Entry(entity).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    // Tar bort en entitet från databasen
    public virtual Task RemoveAsync(TEntity entity)
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }
}