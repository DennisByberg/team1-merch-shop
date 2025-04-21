using MerchStore.Domain.Common;

namespace MerchStore.Domain.Interfaces;

// Generiskt repository-interface för standard CRUD-operationer.
// TEntity representerar entitetstypen och TId är dess unika identifierare.
public interface IRepository<TEntity, TId>
    where TEntity : Entity<TId>
    where TId : notnull
{
    Task<TEntity?> GetByIdAsync(TId id);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task AddAsync(TEntity entity);
    Task UpdateAsync(TEntity entity);
    Task RemoveAsync(TEntity entity);
}