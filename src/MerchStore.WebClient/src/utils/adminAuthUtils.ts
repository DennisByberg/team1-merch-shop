const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

// Checks if either CLIENT_ID or CLIENT_SECRET environment variables are missing
export function areSSoCredentialsMissing(): boolean {
  return !CLIENT_ID || !CLIENT_SECRET;
}

// Validates SSO credentials are configured and sets error if they're missing
export function validateSSOCredentials(setError: (error: string) => void): boolean {
  if (areSSoCredentialsMissing()) {
    setError(
      'SSO initiation credentials are not configured in the application environment.'
    );
    return false;
  }
  return true;
}

// Compares provided username and password against environment credential values
export function isValidCredentials(username: string, password: string): boolean {
  return username === CLIENT_ID && password === CLIENT_SECRET;
}
