namespace MerchStore.Domain.Common;

public abstract class Entity<TId> : IEquatable<Entity<TId>> where TId : notnull
{
    public TId Id { get; protected set; }

    protected Entity(TId id)
    {
        // Basic validation, can be expanded
        if (EqualityComparer<TId>.Default.Equals(id, default))
        {
            throw new ArgumentException("The entity ID cannot be the default value.", nameof(id));
        }

        Id = id;
    }

    // Required for EF Core, even if using private setters elsewhere
#pragma warning disable CS8618
    protected Entity() { }
#pragma warning restore CS8618

    public override bool Equals(object? obj)
    {
        return obj is Entity<TId> entity && Id.Equals(entity.Id);
    }

    public bool Equals(Entity<TId>? other)
    {
        return Equals((object?)other);
    }

    public static bool operator ==(Entity<TId> left, Entity<TId> right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(Entity<TId> left, Entity<TId> right)
    {
        return !Equals(left, right);
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}