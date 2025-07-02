import React, { useRef } from 'react';

interface ChatInputProps {
  inputMessage: string;
  isConnected: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  isConnected,
  onInputChange,
  onSubmit
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e);
    // フォーカスを維持
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="border-t border-white/20 bg-white/80 backdrop-blur-sm p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={onInputChange}
            placeholder="メッセージを入力..."
            className="w-full px-4 py-3 sm:py-4 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm pr-12 text-base"
            disabled={!isConnected}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 text-lg">
            ⌨️
          </div>
        </div>
        <button
          type="submit"
          disabled={!isConnected || !inputMessage.trim()}
          className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-secondary-400 disabled:to-secondary-500 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 shadow-medium hover:shadow-strong disabled:shadow-none flex items-center justify-center"
        >
          <span className="mr-2 text-lg">🚀</span>
          送信
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm text-secondary-500">
          💡 別のタブやブラウザでも同じページを開いて、リアルタイム通信を体感してみてください！
        </p>
      </div>
    </div>
  );
};
