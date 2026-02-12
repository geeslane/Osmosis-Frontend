import { useCallback } from 'react';

type UseDownloadFileReturn = {
  downloadFile: (url: string, filename?: string) => Promise<void>;
};

const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/plain': '.txt',
  'text/csv': '.csv',
};

/**
 * Derives a filename from a URL. Keeps known extensions; otherwise returns base name or default.
 */
function getFilenameFromUrl(url: string, defaultName = 'download'): string {
  try {
    const pathname = new URL(url).pathname;
    const segment = pathname.split('/').filter(Boolean).pop() ?? '';
    if (!segment) return defaultName;
    const hasExtension = /\.(pdf|docx?|xlsx?|png|jpe?g|gif|webp|txt|csv)$/i.test(
      segment
    );
    return hasExtension ? segment : segment || defaultName;
  } catch {
    return defaultName;
  }
}

function hasExtension(name: string): boolean {
  return /\.\w+$/.test(name);
}

/**
 * Hook that provides a function to download a file from a URL.
 * Fetches as blob, creates a temporary anchor with download attribute, then revokes the object URL.
 * Works for PDF, images, docs, etc. Falls back to opening in new tab if fetch fails (e.g. CORS).
 */
export default function useDownloadFile(): UseDownloadFileReturn {
  const downloadFile = useCallback(
    async (url: string, filename?: string): Promise<void> => {
      let name = filename ?? getFilenameFromUrl(url, 'workbook');

      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);
        const blob = await res.blob();
        const mime = blob.type;
        if (!hasExtension(name) && mime && MIME_TO_EXT[mime]) {
          name = name.replace(/\.[^.]*$/, '') + MIME_TO_EXT[mime];
        }
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = name;
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    []
  );

  return { downloadFile };
}
