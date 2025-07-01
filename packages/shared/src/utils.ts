// ユニークIDを生成
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// 日時フォーマット
export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

// メッセージをサニタイズ（XSS対策）
export const sanitizeMessage = (content: string): string => {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

// ユーザー名バリデーション
export const validateUserName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 20;
};
