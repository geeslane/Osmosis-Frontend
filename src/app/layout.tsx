import { Montserrat } from 'next/font/google';
import Providers from '@/lib/Providers';
import { GoogleOAuthProvider } from '@react-oauth/google';
import config from '@/config';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadingIndicatorProperties } from '@/utils/constant';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat', // optional CSS variable
  weight: ['300', '400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="max-image-preview:large, NOODP, NOYDIR" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="192x192"
          href="/favicon/android-chrome-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="512x512"
          href="/favicon/android-chrome-512x512.png"
        />
      </head>
      <body
        className={`${montserrat.className} dark:bg-gray-900`}
        suppressHydrationWarning
      >
        <NextTopLoader {...loadingIndicatorProperties} />
        <GoogleOAuthProvider clientId={config.googleClientId ?? ''}>
          <Providers>{children}</Providers>
          <ToastContainer className="z-999999" />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
