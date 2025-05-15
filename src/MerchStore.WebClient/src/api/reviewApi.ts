import axios from 'axios';

// TODO: HIDE!
const apiUrl = import.meta.env.VITE_REVIEW_API;
const apiKey = import.meta.env.VITE_REVIEW_API_KEY;

export async function fetchProductReviews(productId: string) {
  const res = await axios.get(`${apiUrl}/api/products/${productId}/reviews`, {
    headers: { 'x-functions-key': apiKey },
  });

  return res.data;
}
