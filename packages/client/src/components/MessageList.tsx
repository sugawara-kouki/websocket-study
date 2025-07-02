import React, { useRef, useEffect } from 'react';
import { MessageBubble, type MessageData } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: string[];
  typingUser: string;
  parseMessage: (messageStr: string) => MessageData;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  typingUser,
  parseMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-gradient-to-b from-white/20 to-transparent scrollbar-thin">
      {messages.length === 0 ? (
        <div className="text-center text-secondary-500 py-12 animate-fade-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary-200 to-primary-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl sm:text-3xl">🎉</span>
          </div>
          <p className="text-lg sm:text-xl font-medium mb-2 text-secondary-700">WebSocketチャットへようこそ！</p>
          <p className="text-sm sm:text-base text-secondary-500">メッセージを送信して、リアルタイム通信を体感してみてください</p>
        </div>
      ) : (
        messages.map((messageStr, index) => {
          const message = parseMessage(messageStr);
          return (
            <div key={index} className="animate-fade-in w-full">
              <MessageBubble message={message} />
            </div>
          );
        })
      )}
      
      <TypingIndicator typingUser={typingUser} />
      <div ref={messagesEndRef} />
    </div>
  );
};
