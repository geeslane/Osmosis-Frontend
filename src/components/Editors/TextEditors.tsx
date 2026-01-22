import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

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
    <div className="flex font-montserrat montserrat flex-col gap-2">
      {label && (
        <label className="text-green-300 font-medium">{label}</label>
      )}
      <div className="border p-5 rounded-md border-[#282F2E]">
        <SunEditor
          setOptions={{
            minHeight: '400px',
            maxHeight: '500px',
            placeholder: 'Type...',
            buttonList: [
              [
                'fontSize',
                'formatBlock',
                'fontColor',
                'bold',
                'italic',
                'underline',
                'strike',
              ],
              ['align', 'list', 'image', 'link'],
            ],
            defaultStyle:
              'font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
            fontSize: [10, 12, 14, 16, 18, 20, 24],
            formats: ['p', 'h1', 'h2', 'h3'],
          }}
          setDefaultStyle="font-size: 12px;"
          setContents={value}
          placeholder="Type..."
          onChange={(content) => {
            if (onChange) {
              onChange(content);
            }
          }}
        />

        <style jsx global>{`
          .sun-editor {
            overflow: visible !important;
            border: none;
            font-size: 12px;
          }

          .se-toolbar {
            background-color: #f2f4f7 !important;
            border: none;
            position: relative;
            z-index: 10;
            padding: 6px 8px !important;
            border: none;
          }

          .se-btn-tray {
            gap: 2px;
            border: none;
          }

          .se-btn {
            padding: 4px 6px !important;
            border: none;
            font-size: 12px !important;
            height: 28px !important;
            min-width: 28px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .se-btn svg {
            width: 12px !important;
            height: 12px !important;
            color: #334155;
          }

          .se-btn span {
            font-size: 14px !important;
            line-height: 1 !important;
            color: #334155;
          }

          /* Fix dropdown arrow alignment */
          .se-btn-select {
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            border: none;
          }

          .se-btn-select .txt {
            line-height: 1 !important;
            display: inline-flex !important;
            align-items: center !important;
          }

          .se-btn-select svg {
            margin: 0 !important;
            vertical-align: middle !important;
          }

          /* Tooltip font size */
          .se-tooltip,
          .__se__tooltip {
            font-size: 10px !important;
            padding: 2px 6px !important;
            border: none;
          }

          .se-tooltip-inner {
            font-size: 10px !important;
          }

          .se-wrapper {
            position: relative;
            z-index: 1;
          }

          .se-wrapper-inner {
            background-color: white;
            padding: 16px;
            border: none;
            min-height: 200px !important;
            font-size: 12px;
          }

          .se-wrapper-wysiwyg {
            min-height: 203px !important;
            font-size: 12px !important;
            border: none;
          }

          .se-placeholder::before {
            color: #9ca3af !important;
            font-size: 12px !important;
          }

          /* Fix dropdown visibility */
          .se-list-layer {
            position: absolute !important;
            z-index: 999 !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            font-size: 12px !important;
          }

          .se-selector-color,
          .se-list-format,
          .se-list-font-size {
            max-height: 300px !important;
            overflow-y: auto !important;
            font-size: 12px !important;
          }

          .se-list-inner li button {
            font-size: 12px !important;
            padding: 4px 8px !important;
          }

          /* Ensure dropdowns appear above content */
          .se-dialog,
          .se-controller {
            z-index: 1000 !important;
          }
        `}</style>
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
