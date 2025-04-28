import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  stockQuantity: number;
  inStock: boolean;
};

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = 'http://localhost:5293';

  useEffect(() => {
    setLoading(true);
    axios
      .get<Product[]>(`${apiUrl}/api/products`, {
        headers: {
          'X-API-Key': 'API_KEY', // Replace with your real API key!
        },
      })
      .then((response) => setProducts(response.data))
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h1>Product Catalog</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{ border: '1px solid #eee', padding: 16, width: 220 }}
            >
              <Link
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: 120, objectFit: 'cover' }}
                  />
                )}
                <h2 style={{ fontSize: 18 }}>{product.name}</h2>
                <p>
                  <b>
                    {product.price} {product.currency}
                  </b>
                </p>
                <p>{product.inStock ? 'In stock' : 'Out of stock'}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
