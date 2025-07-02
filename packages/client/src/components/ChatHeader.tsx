import React from 'react';

interface ChatHeaderProps {
  isConnected: boolean;
  onlineUsers: number;
  userName: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isConnected,
  onlineUsers,
  userName
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-white/20 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-medium">
            <span className="text-white text-lg sm:text-xl">💬</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-secondary-800">
              WebSocket チャット
            </h1>
            <p className="text-sm text-secondary-600">リアルタイム体感デモ</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
            isConnected 
              ? 'bg-success-100 text-success-800 border border-success-200' 
              : 'bg-error-100 text-error-800 border border-error-200'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-success-500 animate-pulse' : 'bg-error-500'
            }`}></div>
            {isConnected ? '接続中' : '切断'}
          </div>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 border border-secondary-200">
            👥 {onlineUsers}人
          </div>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200">
            👤 {userName}
          </div>
        </div>
      </div>
    </div>
  );
};
