import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  onlineUsers: number;
  userName: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  onlineUsers,
  userName
}) => {
  return (
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
  );
};
