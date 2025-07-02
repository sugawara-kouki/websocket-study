import React from 'react';

interface JoinFormProps {
  userName: string;
  isConnected: boolean;
  isLoading: boolean;
  onUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const JoinForm: React.FC<JoinFormProps> = ({
  userName,
  isConnected,
  isLoading,
  onUserNameChange,
  onSubmit
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-strong max-w-md w-full border border-white/20 animate-fade-in">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span className="text-2xl sm:text-3xl">💬</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
            WebSocket チャット
          </h1>
          <p className="text-sm sm:text-base text-secondary-600">リアルタイム体感デモ</p>
        </div>
        
        <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
          <h2 className="font-semibold text-primary-800 mb-3 flex items-center text-sm sm:text-base">
            <span className="mr-2">✨</span>
            体感できること
          </h2>
          <ul className="text-xs sm:text-sm text-primary-700 space-y-2">
            <li className="flex items-center"><span className="mr-2">🚀</span>リアルタイムメッセージ送受信</li>
            <li className="flex items-center"><span className="mr-2">👥</span>他のユーザーの参加・退出通知</li>
            <li className="flex items-center"><span className="mr-2">⌨️</span>タイピング通知（入力中表示）</li>
            <li className="flex items-center"><span className="mr-2">📡</span>接続状態のリアルタイム表示</li>
          </ul>
        </div>

        <div className="mb-6 text-center">
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-success-100 text-success-800 border border-success-200' 
              : 'bg-error-100 text-error-800 border border-error-200'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-success-500 animate-pulse' : 'bg-error-500'
            }`}></div>
            {isConnected ? 'サーバー接続中' : 'サーバー未接続'}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-2">
              あなたの名前
            </label>
            <input
              id="username"
              type="text"
              placeholder="名前を入力してください"
              value={userName}
              onChange={onUserNameChange}
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-center text-base"
              required
              minLength={2}
              maxLength={20}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!isConnected || !userName.trim() || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                参加中...
              </>
            ) : isConnected ? (
              <>
                <span className="mr-2">🚀</span>
                チャットに参加
              </>
            ) : (
              '接続を待機中...'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-secondary-500">
            💡 複数のタブやブラウザで開いて試してみてください！
          </p>
        </div>
      </div>
    </div>
  );
};
