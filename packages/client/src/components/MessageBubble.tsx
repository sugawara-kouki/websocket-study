import React from 'react';

export interface MessageData {
  content: string;
  timestamp: string;
  type: 'message' | 'system';
  isMyMessage?: boolean;
}

interface MessageBubbleProps {
  message: MessageData;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center mb-3">
        <div className="bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border border-warning-300 rounded-2xl p-3 text-center text-sm shadow-soft max-w-md">
          <span className="flex items-center justify-center">
            <span className="mr-1">🤖</span>
            {message.content}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className={`rounded-2xl p-3 sm:p-4 shadow-soft break-words ${
          message.isMyMessage
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md'
            : 'bg-white text-secondary-800 border border-secondary-200 rounded-bl-md'
        }`}>
          {message.content}
        </div>
        {message.timestamp && (
          <div className={`text-xs text-secondary-500 mt-1 ${
            message.isMyMessage ? 'text-right mr-1' : 'text-left ml-1'
          }`}>
            {message.timestamp}
          </div>
        )}
      </div>
    </div>
  );
};
