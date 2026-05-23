import React from 'react';
import RichTextEditor from './RichTextEditor';

interface TextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  error?: string;
  label?: string;
}

export default function TextEditors({
  value = '',
  onChange,
  error,
  label = 'Content',
}: TextEditorProps) {
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      error={error}
      label={label}
      placeholder="Type or paste content here…"
      minHeight="320px"
    />
  );
}
