import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const apiUrl =
    'https://merchstorebackend.agreeabledesert-a7938720.swedencentral.azurecontainerapps.io';

  useEffect(() => {
    axios
      .get<Product>(`${apiUrl}/api/products/${id}`, {
        headers: {
          'X-API-Key': 'API_KEY', // Replace with your real API key!
        },
      })
      .then((res) => setProduct(res.data))
      .catch((err) => {
        setProduct(null);
        console.error('Failed to fetch product:', err);
      });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <Link to="/">← Back to catalog</Link>
      <h1>{product.name}</h1>
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }}
        />
      )}
      <p>
        <b>
          {product.price} {product.currency}
        </b>
      </p>
      <p>{product.inStock ? 'In stock' : 'Out of stock'}</p>
      <p>{product.description}</p>
    </div>
  );
}
