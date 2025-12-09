import config from '@/config';
import { Metadata } from 'next';

type MetadataProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
};

export function generateMetadata({
  title = 'Viro',
  description = 'Viro',
  keywords = ['learning'],
  image = '/image/logo1.png',
  url,
}: MetadataProps): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: url ? config.baseUrl + url : config.baseUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'Viro',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    metadataBase: new URL(url ? config.baseUrl + url : config.baseUrl),
    icons: {
      icon: '/favicon/favicon.ico',
    },
  };
}
