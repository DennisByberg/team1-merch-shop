import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchProductReviews(productId: string) {
  const res = await axios.get(`${apiUrl}/api/reviews/product/${productId}`);
  return res.data;
}

export async function fetchProductAverageRating(productId: string) {
  const res = await axios.get(
    `${apiUrl}/api/reviews/product/${productId}/average-rating`
  );
  return res.data;
}

export async function fetchProductReviewCount(productId: string) {
  const res = await axios.get(`${apiUrl}/api/reviews/product/${productId}/count`);
  return res.data;
}
