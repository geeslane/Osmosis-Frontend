import {
  BibleVerse,
  fetchBibleVerse,
  getRandomReference,
} from '@/store/bible/bibleApi';

export async function loadVerse(): Promise<BibleVerse | null> {
  const reference = getRandomReference();
  const data = await fetchBibleVerse(reference);
  return data;
}
