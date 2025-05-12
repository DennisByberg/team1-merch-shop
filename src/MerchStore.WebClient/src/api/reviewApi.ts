import axios from 'axios';

// TODO: HIDE!
const apiUrl = 'https://reviewapifunc20250507.azurewebsites.net';
const apiKey = 'API_KEY';

export async function fetchProductReviews(productId: string) {
  const res = await axios.get(`${apiUrl}/api/products/${productId}/reviews`, {
    headers: { 'x-functions-key': apiKey },
  });

  return res.data;
}
