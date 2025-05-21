// Base URL for your backend's authentication server
const AUTH_SERVER_BASE_URL = import.meta.env.VITE_API_URL;
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

console.log(window.location.origin);

// Get client ID and secret from environment variables
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

const SCOPES = 'openid';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    'FATAL ERROR: VITE_CLIENT_ID or VITE_CLIENT_SECRET is not defined in .env file.'
  );
}

export function redirectToLogin() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
  });

  window.location.href = `${AUTH_SERVER_BASE_URL}/connect/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    const errorMessage =
      'Client ID or Client Secret is not configured. Cannot exchange code for token.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const tokenRequestBody = new URLSearchParams();
  tokenRequestBody.append('grant_type', 'authorization_code');
  tokenRequestBody.append('code', code);
  tokenRequestBody.append('redirect_uri', REDIRECT_URI);
  tokenRequestBody.append('client_id', CLIENT_ID);
  tokenRequestBody.append('client_secret', CLIENT_SECRET);

  const response = await fetch(`${AUTH_SERVER_BASE_URL}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenRequestBody.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'unknown_error',
      error_description: `Token request failed with status ${response.status} ${response.statusText}. No error details provided by server.`,
    }));
    console.error('Token exchange failed:', errorData);
    throw new Error(
      errorData.error_description ||
        errorData.error ||
        `Token exchange failed: ${response.status}`
    );
  }

  return await response.json();
}
