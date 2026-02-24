import { Node, mergeAttributes } from '@tiptap/core';

export function getYoutubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // raw video ID
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

export const YoutubeExtension = Node.create({
  name: 'youtube',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      width: 640,
      height: 360,
      nocookie: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-youtube-src'),
        renderHTML: (attrs) => (attrs.src ? { 'data-youtube-src': attrs.src } : {}),
      },
      videoId: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-video-id'),
        renderHTML: (attrs) => (attrs.videoId ? { 'data-video-id': attrs.videoId } : {}),
      },
      width: {
        default: this.options.width,
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-width') || this.options.width,
        renderHTML: (attrs) => ({ 'data-width': attrs.width ?? this.options.width }),
      },
      height: {
        default: this.options.height,
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-height') || this.options.height,
        renderHTML: (attrs) => ({ 'data-height': attrs.height ?? this.options.height }),
      },
    };
  },

  parseHTML() {
    const getAttrsFromDiv = (dom: Node) => {
      const el = dom as HTMLElement;
      const dataVideoId = el.getAttribute?.('data-video-id');
      const dataSrc = el.getAttribute?.('data-youtube-src');
      if (dataVideoId) {
        const src = dataSrc || `https://www.youtube-nocookie.com/embed/${dataVideoId}`;
        return { videoId: dataVideoId, src };
      }
      const iframe = el.querySelector?.('iframe[src*="youtube"]');
      const src = (iframe?.getAttribute?.('src') || '') as string;
      const videoId = getYoutubeVideoId(src);
      return videoId ? { videoId, src } : false;
    };
    return [
      {
        tag: 'div[data-video-id]',
        getAttrs: getAttrsFromDiv,
      },
      {
        tag: 'div[data-youtube-embed]',
        getAttrs: getAttrsFromDiv,
      },
      {
        tag: 'div',
        getAttrs: (dom) => {
          const el = dom as HTMLElement;
          if (el.getAttribute?.('data-video-id')) return getAttrsFromDiv(dom);
          if (!el.querySelector?.('iframe[src*="youtube"]')) return false;
          return getAttrsFromDiv(dom);
        },
      },
      {
        tag: 'iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]',
        getAttrs: (dom) => {
          const src = (dom as HTMLElement).getAttribute('src') || '';
          const videoId = getYoutubeVideoId(src);
          return videoId ? { videoId, src } : false;
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const videoId = node.attrs.videoId || getYoutubeVideoId(node.attrs.src || '');
    if (!videoId) {
      return ['div', mergeAttributes(this.options.HTMLAttributes, { 'data-youtube-embed': '', class: 'rounded bg-gray-100 p-4 text-gray-500 text-sm' }, HTMLAttributes), 'Invalid YouTube URL'];
    }
    const base = this.options.nocookie ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
    const embedSrc = `${base}/embed/${videoId}`;
    const width = node.attrs.width ?? this.options.width;
    const height = node.attrs.height ?? this.options.height;
    const wrapperAttrs = {
      class: 'youtube-embed-wrapper my-4',
      'data-youtube-embed': '',
      'data-video-id': videoId,
      'data-youtube-src': node.attrs.src || embedSrc,
    };
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, wrapperAttrs, HTMLAttributes),
      [
        'iframe',
        mergeAttributes(this.options.HTMLAttributes, {
          src: embedSrc,
          width: String(width),
          height: String(height),
          frameborder: '0',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowfullscreen: 'true',
          title: 'YouTube video',
          class: 'rounded-lg w-full max-w-full',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options: { src: string; width?: number; height?: number }) =>
        ({ commands }) => {
          const videoId = getYoutubeVideoId(options.src);
          if (!videoId) return false;
          // Insert at cursor: YouTube block + empty paragraph so existing content is not replaced
          return commands.insertContent([
            {
              type: this.name,
              attrs: {
                src: options.src,
                videoId,
                width: options.width ?? this.options.width,
                height: options.height ?? this.options.height,
              },
            },
            { type: 'paragraph' },
          ]);
        },
    };
  },
});
