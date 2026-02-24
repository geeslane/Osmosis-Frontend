'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { YoutubeExtension } from './youtubeExtension';
import UrlPromptModal, { type UrlPromptType } from './UrlPromptModal';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

const Toolbar = ({
  editor,
  onOpenUrlModal,
}: {
  editor: Editor | null;
  onOpenUrlModal: (type: UrlPromptType, initialValue?: string) => void;
}) => {
  if (!editor) return null;

  const linkUrl = editor.getAttributes('link').href || '';

  const handleLinkClick = () => {
    onOpenUrlModal('link', linkUrl || '');
  };

  const buttonClass =
    'p-2 rounded text-gray-600 hover:bg-green-100/80 hover:text-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors';
  const activeClass = 'bg-green-100 text-green-800';
  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-[#F8FAFC] px-2 py-1.5 rounded-t-md">
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${buttonClass} ${editor.isActive('bold') ? activeClass : ''}`}
        title="Bold"
      >
        <BoldIcon />
      </button>
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${buttonClass} ${editor.isActive('italic') ? activeClass : ''}`}
        title="Italic"
      >
        <ItalicIcon />
      </button>
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${buttonClass} ${editor.isActive('underline') ? activeClass : ''}`}
        title="Underline"
      >
        <UnderlineIcon />
      </button>
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`${buttonClass} ${editor.isActive('strike') ? activeClass : ''}`}
        title="Strikethrough"
      >
        <StrikeIcon />
      </button>
      <span className="w-px h-5 bg-gray-200 mx-0.5" aria-hidden />
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${buttonClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : ''}`}
        title="Heading 3"
      >
        H3
      </button>
      <span className="w-px h-5 bg-gray-200 mx-0.5" aria-hidden />
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => {
          const chain = editor.chain().focus();
          if (editor.isActive('blockquote')) chain.lift('blockquote');
          chain.toggleBulletList().run();
        }}
        className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
        title="Bullet list"
      >
        <ListIcon />
      </button>
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => {
          const chain = editor.chain().focus();
          if (editor.isActive('blockquote')) chain.lift('blockquote');
          chain.toggleOrderedList().run();
        }}
        className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
        title="Numbered list"
      >
        <OrderedListIcon />
      </button>
      <button
        type="button"
        onMouseDown={keepFocus}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${buttonClass} ${editor.isActive('blockquote') ? activeClass : ''}`}
        title="Quote"
      >
        <QuoteIcon />
      </button>
      <span className="w-px h-5 bg-gray-200 mx-0.5" aria-hidden />
      <button
        type="button"
        onClick={handleLinkClick}
        className={`${buttonClass} ${editor.isActive('link') ? activeClass : ''}`}
        title="Link"
      >
        <LinkIcon />
      </button>
      <button
        type="button"
        onClick={() => onOpenUrlModal('image')}
        className={buttonClass}
        title="Insert image by URL"
      >
        <ImageIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass}
        title="Horizontal rule"
      >
        <HRIcon />
      </button>
      <span className="w-px h-5 bg-gray-200 mx-0.5" aria-hidden />
      <button
        type="button"
        onClick={() => onOpenUrlModal('youtube')}
        className={buttonClass}
        title="Embed YouTube video"
      >
        <YoutubeIcon />
      </button>
    </div>
  );
};

function BoldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>
  );
}
function ItalicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
  );
}
function UnderlineIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" y1="20" x2="20" y2="20" /></svg>
  );
}
function StrikeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><path d="M4 12h16" /></svg>
  );
}
function ListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
  );
}
function OrderedListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
  );
}
function QuoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2z" /></svg>
  );
}
function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
  );
}
function HRIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
  );
}
function ImageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  );
}
function YoutubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  );
}

export default function RichTextEditor({
  value = '',
  onChange,
  error,
  label = 'Content',
  placeholder = 'Type or paste content here…',
  minHeight = '240px',
}: RichTextEditorProps) {
  const valueRef = useRef(value);
  const [urlModal, setUrlModal] = useState<{
    type: UrlPromptType;
    initialValue: string;
  } | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-green-200 underline hover:text-green-300' },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: true }),
      YoutubeExtension.configure({ width: 640, height: 360, nocookie: true }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-[#282F2E]',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== valueRef.current) {
        valueRef.current = html;
        onChange?.(html);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    const normalizedValue = (value || '').trim() || '<p></p>';
    if (normalizedValue === valueRef.current) return;
    const currentHtml = editor.getHTML();
    if (currentHtml === normalizedValue) return;
    const editorEl = editor.view.dom;
    if (editorEl && typeof document !== 'undefined' && document.activeElement && editorEl.contains(document.activeElement)) return;
    valueRef.current = normalizedValue;
    editor.commands.setContent(normalizedValue, { emitUpdate: false });
  }, [value, editor]);

  const handleUrlConfirm = (url: string) => {
    if (!editor || !urlModal) return;
    const { type } = urlModal;
    if (type === 'link') {
      if (!url.trim()) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor.chain().focus().setLink({ href: url.trim() }).run();
      }
    } else if (type === 'image') {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    } else if (type === 'youtube') {
      (editor.chain().focus() as { setYoutubeVideo: (attrs: { src: string }) => ReturnType<Editor['chain']> }).setYoutubeVideo({ src: url.trim() }).run();
    }
    setUrlModal(null);
  };

  return (
    <div className="flex flex-col gap-2 font-montserrat">
      {label && (
        <label className="text-green-300 font-medium">{label}</label>
      )}
      <div
        className="border border-[#282F2E] rounded-md overflow-hidden bg-white"
        style={{ minHeight }}
      >
        <Toolbar
          editor={editor}
          onOpenUrlModal={(type, initialValue) =>
            setUrlModal({ type, initialValue: initialValue ?? '' })
          }
        />
        <div className="min-h-[200px]" style={{ minHeight: '200px' }}>
          <EditorContent editor={editor} />
        </div>
      </div>
      <UrlPromptModal
        isOpen={!!urlModal}
        type={urlModal?.type ?? 'link'}
        initialValue={urlModal?.initialValue ?? ''}
        allowEmpty={urlModal?.type === 'link'}
        onConfirm={handleUrlConfirm}
        onCancel={() => setUrlModal(null)}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1.75rem;
          margin: 0.5em 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          list-style-position: outside;
          padding-left: 1.75rem;
          margin: 0.5em 0;
        }
        .ProseMirror li {
          margin: 0.25em 0;
          display: list-item;
        }
        .ProseMirror ul ul { list-style-type: circle; }
        .ProseMirror ul ul ul { list-style-type: square; }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; margin: 0.75em 0 0.25em; }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; margin: 0.6em 0 0.2em; }
        .ProseMirror h3 { font-size: 1.125rem; font-weight: 600; margin: 0.5em 0 0.2em; }
        .ProseMirror blockquote {
          border-left: 4px solid #6CBB01;
          padding-left: 1rem;
          margin: 0.75em 0;
          color: #475569;
          font-style: italic;
          background: #f8fafc;
          padding: 0.5em 1rem;
          border-radius: 0 4px 4px 0;
        }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 4px; }
      `}</style>
    </div>
  );
}
