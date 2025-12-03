// src/services/bibleApi.ts

export interface BibleVerse {
  reference: string;
  text: string;
  book_name: string;
  chapter: number;
  verse: number;
}

const baseURL = 'https://bible-api.com';

const references = [
  'John 3:16',
  'Psalm 23:1',
  'Romans 8:28',
  'Philippians 4:13',
  'Genesis 1:1',
  'Matthew 5:9',
  'Proverbs 3:5',
  'Isaiah 41:10',
  '1 Corinthians 13:4',
  'Hebrews 11:1',
];

export function getRandomReference(): string {
  return references[Math.floor(Math.random() * references.length)];
}

// 📥 Fetch a single verse
export async function fetchBibleVerse(
  reference: string
): Promise<BibleVerse | null> {
  try {
    const res = await fetch(`${baseURL}/${encodeURIComponent(reference)}`);
    const data = await res.json();

    const first = data.verses?.[0];
    if (!first) return null;

    return {
      reference: data.reference,
      text: first.text,
      book_name: first.book_name,
      chapter: first.chapter,
      verse: first.verse,
    };
  } catch (error) {
    console.error('Bible API Error:', error);
    return null;
  }
}
