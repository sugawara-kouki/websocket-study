// ユーザー情報の型定義
export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  joinedAt: Date;
}

// チャットメッセージの型定義
export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: Date;
  type: 'message' | 'system' | 'notification';
  isPrivate?: boolean;
  targetUserId?: string;
}

// ルーム情報の型定義
export interface Room {
  id: string;
  name: string;
  description?: string;
  users: User[];
  messages: ChatMessage[];
  createdAt: Date;
  maxUsers: number;
}

// タイピング情報の型定義
export interface TypingInfo {
  userId: string;
  userName: string;
  isTyping: boolean;
}

// Socket.IOイベントの型定義
export interface ServerToClientEvents {
  'user:joined': (user: User) => void;
  'user:left': (user: User) => void;
  'message:received': (message: ChatMessage) => void;
  'message:history': (messages: ChatMessage[]) => void;
  'typing:start': (typingInfo: TypingInfo) => void;
  'typing:stop': (typingInfo: TypingInfo) => void;
  'room:joined': (room: Room) => void;
  'error:occurred': (error: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  'user:join': (userData: { name: string; avatar?: string }) => void;
  'message:send': (data: { content: string; roomId?: string }) => void;
  'message:private': (data: { content: string; targetUserId: string }) => void;
  'typing:start': (roomId?: string) => void;
  'typing:stop': (roomId?: string) => void;
}
