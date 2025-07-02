import React from 'react';

interface TypingIndicatorProps {
  typingUser: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUser }) => {
  if (!typingUser) return null;

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-secondary-100 text-secondary-600 rounded-2xl rounded-bl-md px-4 py-2 text-sm border border-secondary-200 max-w-xs sm:max-w-sm shadow-soft">
        <span className="flex items-center">
          <div className="flex space-x-1 mr-2">
            <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          {typingUser}
        </span>
      </div>
    </div>
  );
};
