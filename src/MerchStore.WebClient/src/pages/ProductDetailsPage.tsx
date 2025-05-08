import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product, Review } from '../types/globalTypes';
import { Box, Button, Typography, Divider, Rating } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchProduct } from '../api/productApi';
import {
  fetchProductReviews,
  fetchProductAverageRating,
  fetchProductReviewCount,
} from '../api/reviewApi';
import { useCart } from '../hooks/useCart';
import { ProductDetailsCard } from '../components/Store/ProductDetailsCard';
import PageBreadcrumbs from '../components/PageBreadcrumbs';

export function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const { id } = useParams();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  const cartItem = items.find((item) => item.id === product?.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const CONTINUE_SHOPPING_TEXT = 'Continue shopping';

  useEffect(() => {
    if (!id) return;
    fetchProduct(id)
      .then(setProduct)
      .catch((err) => {
        setProduct(null);
        console.error('Failed to fetch product:', err);
      });

    fetchProductReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]));

    fetchProductAverageRating(id)
      .then(setAverageRating)
      .catch(() => setAverageRating(0));

    fetchProductReviewCount(id)
      .then(setReviewCount)
      .catch(() => setReviewCount(0));
  }, [id]);

  if (!product) return <Box>Loading...</Box>;

  return (
    <Box>
      <PageBreadcrumbs productName={product?.name} />
      <ProductDetailsCard
        product={product}
        quantityInCart={quantityInCart}
        addToCart={addToCart}
      />

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Reviews ({reviewCount})
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Rating value={averageRating} precision={0.1} readOnly />
          <Typography variant="body1" ml={2}>
            {averageRating.toFixed(1)} / 5
          </Typography>
        </Box>
        <Divider />
        {reviews.length === 0 ? (
          <Typography mt={2}>No reviews yet.</Typography>
        ) : (
          reviews.map((review) => (
            <Box
              key={review.id}
              mt={2}
              mb={2}
              p={2}
              border={1}
              borderRadius={2}
              borderColor="grey.300"
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {review.title}
              </Typography>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {review.customerName} • {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
              <Typography mt={1}>{review.content}</Typography>
            </Box>
          ))
        )}
      </Box>

      <Button
        sx={{ mt: 2 }}
        color={'inherit'}
        variant={'outlined'}
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
      >
        {CONTINUE_SHOPPING_TEXT}
      </Button>
    </Box>
  );
}
