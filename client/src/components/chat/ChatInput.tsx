import React, { useState, useRef, KeyboardEvent } from 'react';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-end space-x-2 max-w-4xl mx-auto relative rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type your message..."
          className="flex-1 max-h-32 min-h-[56px] py-4 pl-4 pr-12 bg-transparent resize-none focus:outline-none text-gray-800 dark:text-gray-100 disabled:opacity-50"
          rows={1}
        />
        <div className="absolute right-2 bottom-2">
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="p-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
      <div className="text-center mt-2">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Press Enter to send, Shift + Enter for new line
        </span>
      </div>
    </div>
  );
};
