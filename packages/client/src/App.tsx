import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@app/shared';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [typingUser, setTypingUser] = useState('');
  
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.IO接続
  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001');
    socketRef.current = socket;

    // 接続イベント
    socket.on('connect', () => {
      console.log('🔗 WebSocket接続成功！');
      setIsConnected(true);
      addSystemMessage('WebSocketサーバーに接続しました');
    });

    socket.on('disconnect', () => {
      console.log('💔 WebSocket切断');
      setIsConnected(false);
      addSystemMessage('WebSocketサーバーから切断されました');
    });

    // メッセージ受信
    socket.on('message:received', (message) => {
      if (message.type === 'system') {
        addSystemMessage(message.content);
      } else {
        addMessage(`${message.userName}: ${message.content}`);
      }
      setOnlineUsers(prev => prev); // 仮の更新
    });

    // メッセージ履歴
    socket.on('message:history', (messageHistory) => {
      messageHistory.forEach(msg => {
        if (msg.type === 'system') {
          addSystemMessage(msg.content);
        } else {
          addMessage(`${msg.userName}: ${msg.content}`);
        }
      });
    });

    // ユーザー参加・退出
    socket.on('user:joined', (user) => {
      addSystemMessage(`${user.name}さんが参加しました`);
      setOnlineUsers(prev => prev + 1);
    });

    socket.on('user:left', (user) => {
      addSystemMessage(`${user.name}さんが退出しました`);
      setOnlineUsers(prev => Math.max(0, prev - 1));
    });

    // タイピング通知
    socket.on('typing:start', (typingInfo) => {
      setTypingUser(`${typingInfo.userName}が入力中...`);
    });

    socket.on('typing:stop', () => {
      setTypingUser('');
    });

    // ルーム参加完了
    socket.on('room:joined', (room) => {
      setOnlineUsers(room.users.length);
      addSystemMessage(`${room.name}に参加しました`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const addSystemMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, `[${timestamp}] 🤖 ${message}`]);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && socketRef.current) {
      socketRef.current.emit('user:join', { name: userName.trim() });
      setIsJoined(true);
      addSystemMessage(`${userName}として参加中...`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socketRef.current && isJoined) {
      socketRef.current.emit('message:send', { content: inputMessage.trim() });
      addMessage(`あなた: ${inputMessage.trim()}`);
      setInputMessage('');
      
      // タイピング停止通知
      socketRef.current.emit('typing:stop');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    // タイピング通知
    if (socketRef.current && isJoined) {
      if (e.target.value.length > 0) {
        socketRef.current.emit('typing:start');
      } else {
        socketRef.current.emit('typing:stop');
      }
    }
  };

  // 参加前の画面
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            🚀 WebSocket体感デモ
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">✨ 体感できること</h2>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• リアルタイムメッセージ送受信</li>
              <li>• 他のユーザーの参加・退出通知</li>
              <li>• タイピング通知（入力中表示）</li>
              <li>• 接続状態のリアルタイム表示</li>
            </ul>
          </div>

          <div className="mb-4">
            <div className={`text-center text-sm mb-4 ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected ? '🟢 サーバー接続中' : '🔴 サーバー未接続'}
            </div>
          </div>

          <form onSubmit={handleJoin}>
            <input
              type="text"
              placeholder="あなたの名前を入力"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-center"
              required
              minLength={2}
              maxLength={20}
            />
            <button
              type="submit"
              disabled={!isConnected || !userName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {isConnected ? 'チャットに参加' : '接続中...'}
            </button>
          </form>

          <div className="mt-4 text-xs text-gray-500 text-center">
            複数のタブやブラウザで開いて試してみてください！
          </div>
        </div>
      </div>
    );
  }

  // チャット画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        
        {/* ヘッダー */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              💬 WebSocketチャット体感デモ
            </h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className={`${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? '🟢 接続中' : '🔴 切断'}
              </span>
              <span className="text-gray-600">
                👥 オンライン: {onlineUsers}人
              </span>
              <span className="text-blue-600">
                👤 {userName}
              </span>
            </div>
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 bg-white mx-4 my-4 rounded-lg shadow-sm border overflow-hidden flex flex-col">
          
          {/* メッセージ一覧 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg mb-2">🎉 WebSocketチャットへようこそ！</p>
                <p className="text-sm">メッセージを送信して、リアルタイム通信を体感してみてください</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-xs ${
                    message.includes('🤖') 
                      ? 'bg-yellow-100 text-yellow-800 mx-auto text-center text-sm'
                      : message.includes('あなた:')
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-white text-gray-800 mr-auto border'
                  }`}
                >
                  {message}
                </div>
              ))
            )}
            
            {/* タイピングインジケーター */}
            {typingUser && (
              <div className="text-sm text-gray-500 italic bg-gray-200 rounded-lg p-2 w-fit">
                {typingUser}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 入力フォーム */}
          <div className="border-t bg-white p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="メッセージを入力... (リアルタイムで相手に通知されます)"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!isConnected || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                送信
              </button>
            </form>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              💡 別のタブやブラウザでも同じページを開いて、リアルタイム通信を体感してみてください！
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;