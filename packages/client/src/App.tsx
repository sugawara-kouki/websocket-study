import React, { useState } from 'react';
import { JoinForm, ChatHeader, MessageList, ChatInput } from './components';
import { useWebSocket } from './hooks';

function App() {
  console.log("これは出ているのか？");
  
  const [userName, setUserName] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    isConnected,
    messages,
    onlineUsers,
    typingUser,
    parseMessage,
    sendMessage,
    joinRoom,
    startTyping,
    stopTyping
  } = useWebSocket();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsLoading(true);
      joinRoom(userName.trim());
      setIsJoined(true);
      // ルーム参加完了後にローディングを解除（useWebSocketで管理）
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isJoined) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
      stopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    if (isJoined) {
      if (e.target.value.length > 0) {
        startTyping();
      } else {
        stopTyping();
      }
    }
  };

  // 参加前の画面
  if (!isJoined) {
    return (
      <JoinForm
        userName={userName}
        isConnected={isConnected}
        isLoading={isLoading}
        onUserNameChange={(e) => setUserName(e.target.value)}
        onSubmit={handleJoin}
      />
    );
  }

  // チャット画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="w-full max-w-6xl mx-auto h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        
        <ChatHeader
          isConnected={isConnected}
          onlineUsers={onlineUsers}
          userName={userName}
        />

        {/* メッセージエリア */}
        <div className="flex-1 bg-white/60 backdrop-blur-sm mx-0 sm:mx-4 my-4 rounded-2xl shadow-soft border border-white/20 overflow-hidden flex flex-col">
          <MessageList
            messages={messages}
            typingUser={typingUser}
            parseMessage={parseMessage}
          />
          
          <ChatInput
            inputMessage={inputMessage}
            isConnected={isConnected}
            onInputChange={handleInputChange}
            onSubmit={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;