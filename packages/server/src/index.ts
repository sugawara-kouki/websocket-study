import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  User,
  ChatMessage,
  Room,
  TypingInfo
} from '@app/shared';
import { generateId, sanitizeMessage, validateUserName } from '@app/shared';

const app = express();
const httpServer = createServer(app);

// Socket.IO サーバー設定
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CLIENT_URL 
      : ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Express設定
app.use(cors());
app.use(express.json());

// アプリケーション状態管理
const users = new Map<string, User>();
const rooms = new Map<string, Room>();
const userRooms = new Map<string, string>(); // userId -> roomId
const typingUsers = new Map<string, TypingInfo>();

// デフォルトルーム作成
const defaultRoom: Room = {
  id: 'general',
  name: '一般チャット',
  description: 'みんなでお話ししましょう！',
  users: [],
  messages: [],
  createdAt: new Date(),
  maxUsers: 100
};
rooms.set('general', defaultRoom);

// Socket.IO接続処理
io.on('connection', (socket) => {
  console.log(`🔗 新しい接続: ${socket.id}`);
  
  // ユーザー参加処理
  socket.on('user:join', (userData) => {
    console.log(`👤 ユーザー参加リクエスト: ${userData.name}`);
    
    if (!validateUserName(userData.name)) {
      socket.emit('error:occurred', { 
        message: '名前は2文字以上20文字以下で入力してください',
        code: 'INVALID_USERNAME'
      });
      return;
    }

    const user: User = {
      id: socket.id,
      name: sanitizeMessage(userData.name),
      avatar: userData.avatar,
      isOnline: true,
      joinedAt: new Date()
    };

    users.set(socket.id, user);
    
    // デフォルトルームに参加
    const room = rooms.get('general');
    if (room) {
      room.users.push(user);
      userRooms.set(socket.id, 'general');
      socket.join('general');
      
      // 参加通知
      socket.to('general').emit('user:joined', user);
      
      // 現在のルーム情報を送信
      socket.emit('room:joined', room);
      
      // メッセージ履歴を送信
      socket.emit('message:history', room.messages.slice(-50));
      
      // システムメッセージ
      const systemMessage: ChatMessage = {
        id: generateId(),
        content: `${user.name}さんがチャットに参加しました`,
        userId: 'system',
        userName: 'システム',
        timestamp: new Date(),
        type: 'system'
      };
      
      room.messages.push(systemMessage);
      socket.to('general').emit('message:received', systemMessage);
      
      console.log(`✅ ユーザー参加完了: ${user.name}`);
    }
  });

  // メッセージ送信処理
  socket.on('message:send', (data) => {
    const user = users.get(socket.id);
    const roomId = userRooms.get(socket.id) || 'general';
    const room = rooms.get(roomId);
    
    if (!user || !room) {
      socket.emit('error:occurred', { 
        message: 'ユーザーまたはルームが見つかりません' 
      });
      return;
    }

    const message: ChatMessage = {
      id: generateId(),
      content: sanitizeMessage(data.content),
      userId: user.id,
      userName: user.name,
      timestamp: new Date(),
      type: 'message'
    };

    room.messages.push(message);
    
    // メッセージ履歴制限
    if (room.messages.length > 1000) {
      room.messages = room.messages.slice(-500);
    }

    // ルーム内の全員に送信
    io.to(roomId).emit('message:received', message);
    
    console.log(`💬 [${roomId}] ${user.name}: ${data.content}`);
  });

  // タイピング開始
  socket.on('typing:start', (roomId = 'general') => {
    const user = users.get(socket.id);
    if (user) {
      const typingInfo: TypingInfo = {
        userId: user.id,
        userName: user.name,
        isTyping: true
      };
      
      typingUsers.set(socket.id, typingInfo);
      socket.to(roomId).emit('typing:start', typingInfo);
    }
  });

  // タイピング終了
  socket.on('typing:stop', (roomId = 'general') => {
    const typingInfo = typingUsers.get(socket.id);
    if (typingInfo) {
      typingUsers.delete(socket.id);
      socket.to(roomId).emit('typing:stop', typingInfo);
    }
  });

  // 切断処理
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    const roomId = userRooms.get(socket.id);
    
    if (user && roomId) {
      const room = rooms.get(roomId);
      if (room) {
        room.users = room.users.filter(u => u.id !== socket.id);
        socket.to(roomId).emit('user:left', user);
        
        const systemMessage: ChatMessage = {
          id: generateId(),
          content: `${user.name}さんがチャットを退出しました`,
          userId: 'system',
          userName: 'システム',
          timestamp: new Date(),
          type: 'system'
        };
        
        room.messages.push(systemMessage);
        socket.to(roomId).emit('message:received', systemMessage);
      }
      
      users.delete(socket.id);
      userRooms.delete(socket.id);
      typingUsers.delete(socket.id);
      
      console.log(`👋 ユーザー退出: ${user.name}`);
    }
  });
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connectedUsers: users.size,
    activeRooms: rooms.size
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
  console.log(`📊 ヘルスチェック: http://localhost:${PORT}/api/health`);
});
