const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  NODE_ENV: process.env.NODE_ENV,
};

export default config;
