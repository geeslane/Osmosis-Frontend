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
  title = 'FOJO - Followers of Jesus Only',
  description = 'At FOJO, we are a community of believers passionately committed to walking in the footsteps of Jesus Christ—nothing more, nothing less. In a world full of compromise and distraction, FOJO stands as a bold call back to authentic discipleship: living out the teachings of Christ with unwavering truth and fearless faith.',
  keywords = [
    'Jesus',
    'Christian Discipleship',
    'Bible Study',
    'Faith',
    'Spirit-filled',
    'Biblical Teachings',
    'Christian Videos',
    'Fearless Faith',
    'Followers of Jesus',
    'FOJO',
    'True Christianity',
    'Christian Learning Platform',
  ],
  image = '/images/home/logo.png',
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
          alt: 'FOJO - Followers of Jesus Only',
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
