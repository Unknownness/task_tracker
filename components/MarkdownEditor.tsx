'use client';

import { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Link, Code, Heading, Quote, Type } from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const markdownShortcuts = [
  {
    name: 'Заголовок',
    icon: <Heading size={16} />,
    prefix: '# ',
    suffix: '',
    description: 'Добавить заголовок'
  },
  {
    name: 'Подзаголовок',
    icon: <Heading size={16} />,
    prefix: '## ',
    suffix: '',
    description: 'Добавить подзаголовок'
  },
  {
    name: 'Жирный',
    icon: <Bold size={16} />,
    prefix: '**',
    suffix: '**',
    description: 'Сделать текст жирным'
  },
  {
    name: 'Курсив',
    icon: <Italic size={16} />,
    prefix: '*',
    suffix: '*',
    description: 'Сделать текст курсивом'
  },
  {
    name: 'Ссылка',
    icon: <Link size={16} />,
    prefix: '[текст](',
    suffix: ')',
    description: 'Добавить ссылку'
  },
  {
    name: 'Маркированный список',
    icon: <List size={16} />,
    prefix: '- ',
    suffix: '',
    description: 'Добавить элемент списка'
  },
  {
    name: 'Нумерованный список',
    icon: <ListOrdered size={16} />,
    prefix: '1. ',
    suffix: '',
    description: 'Добавить нумерованный список'
  },
  {
    name: 'Код',
    icon: <Code size={16} />,
    prefix: '`',
    suffix: '`',
    description: 'Вставить код'
  },
  {
    name: 'Цитата',
    icon: <Quote size={16} />,
    prefix: '> ',
    suffix: '',
    description: 'Добавить цитату'
  }
];

export default function MarkdownEditor({ value, onChange, placeholder, className = '' }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);

    onChange(newText);

    // Устанавливаем курсор после вставки
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newText = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-xs text-gray-500 mr-2 whitespace-nowrap">Разметка:</span>
          {markdownShortcuts.map((shortcut, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertMarkdown(shortcut.prefix, shortcut.suffix)}
              title={shortcut.description}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-700"
            >
              <div className="flex items-center gap-1">
                {shortcut.icon}
                <span className="text-xs hidden sm:inline">{shortcut.name}</span>
              </div>
            </button>
          ))}
        </div>
        
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <Type size={14} />
          {showPreview ? 'Редактировать' : 'Предпросмотр'}
        </button>
      </div>

      {/* Content */}
      {showPreview ? (
        <div className="min-h-[200px] p-4 bg-white prose prose-sm max-w-none">
          <MarkdownPreview content={value} />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleTabKey}
          placeholder={placeholder || 'Напишите заметку с поддержкой Markdown...'}
          className="w-full min-h-[200px] p-4 resize-none focus:outline-none focus:ring-0"
          rows={10}
        />
      )}
      
      {/* Help text */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2">
        <p className="text-xs text-gray-500">
          Поддерживается Markdown: заголовки (# ##), *курсив*, **жирный**, списки (- 1.), [ссылки](url), `код`
        </p>
      </div>
    </div>
  );
}