
export const loadingIndicatorProperties = {
  color: '#FE6D00',
  height: 3.5,
  showSpinner: true,
  zIndex: 999999999,
};
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
};
export const googleUserInfoUrl =
  'https://www.googleapis.com/oauth2/v3/userinfo';
