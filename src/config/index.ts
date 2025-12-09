const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  googleClientId:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID_NOT_SET',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default config;
