import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@app/shared';
import type { MessageData } from '../components';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [typingUser, setTypingUser] = useState('');
  
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

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
        const isMyMessage = message.userId === socket.id;
        const displayName = isMyMessage ? 'あなた' : message.userName;
        addMessage(`${displayName}: ${message.content}`, isMyMessage);
      }
    });

    // メッセージ履歴
    socket.on('message:history', (messageHistory) => {
      messageHistory.forEach(msg => {
        if (msg.type === 'system') {
          addSystemMessage(msg.content);
        } else {
          const isMyMessage = msg.userId === socket.id;
          const displayName = isMyMessage ? 'あなた' : msg.userName;
          addMessage(`${displayName}: ${msg.content}`, isMyMessage);
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

  const addMessage = (message: string, isMyMessage: boolean = false) => {
    const timestamp = new Date().toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    setMessages(prev => [...prev, JSON.stringify({ 
      content: message, 
      timestamp, 
      isMyMessage, 
      type: 'message' 
    })]);
  };

  const addSystemMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    setMessages(prev => [...prev, JSON.stringify({ 
      content: message, 
      timestamp, 
      type: 'system' 
    })]);
  };

  const parseMessage = (messageStr: string): MessageData => {
    try {
      return JSON.parse(messageStr);
    } catch {
      return { content: messageStr, timestamp: '', type: 'message', isMyMessage: false };
    }
  };

  const sendMessage = (content: string) => {
    if (socketRef.current) {
      socketRef.current.emit('message:send', { content });
    }
  };

  const joinRoom = (name: string) => {
    if (socketRef.current) {
      socketRef.current.emit('user:join', { name });
      addSystemMessage(`${name}として参加中...`);
    }
  };

  const startTyping = () => {
    if (socketRef.current) {
      socketRef.current.emit('typing:start');
    }
  };

  const stopTyping = () => {
    if (socketRef.current) {
      socketRef.current.emit('typing:stop');
    }
  };

  return {
    isConnected,
    messages,
    onlineUsers,
    typingUser,
    parseMessage,
    sendMessage,
    joinRoom,
    startTyping,
    stopTyping,
    addSystemMessage
  };
};
