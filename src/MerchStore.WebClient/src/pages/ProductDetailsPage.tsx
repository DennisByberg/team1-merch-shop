import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { IProduct } from '../interfaces';
import { fetchProduct } from '../api/productApi';
import { useCart } from '../hooks/useCart';
import { ProductDetailsCard } from '../components/Store/ProductDetailsCard';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import CustomSpinner from '../components/CustomSpinner';
import { ProductReviews } from '../components/ProductDetails/ProductReviews';
import { useReviews } from '../hooks/useReviews';

export function ProductDetailsPage() {
  const [product, setProduct] = useState<IProduct | null>(null);
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();
  const quantityInCart = items.find((item) => item.id === product?.id)?.quantity || 0;

  const reviewsData = useReviews(product?.id);
  const reviews = reviewsData?.reviews ?? [];
  const stats = reviewsData?.stats;
  const loading = reviewsData?.loading ?? false;

  useEffect(() => {
    if (!id) return;
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [id]);

  const handleReviewsUpdated = () => {
    if (product?.id) {
      reviewsData?.fetchReviews(product.id);
    }
  };

  return (
    <Box>
      {!product ? (
        <CustomSpinner text="Loading product..." />
      ) : (
        <>
          <PageBreadcrumbs productName={product.name} />
          <Box sx={BUTTON_ROW_STYLE}>
            <Button
              color={'inherit'}
              variant={'outlined'}
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/store')}
            >
              Back to Store
            </Button>
          </Box>
          <ProductDetailsCard
            product={product}
            quantityInCart={quantityInCart}
            addToCart={addToCart}
          />
          <ProductReviews
            reviews={reviews}
            stats={stats}
            loading={loading}
            productId={product.id}
            onReviewsUpdated={handleReviewsUpdated}
          />
        </>
      )}
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const BUTTON_ROW_STYLE = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3,
  mt: 3,
};
