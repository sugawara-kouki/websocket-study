"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserName = exports.sanitizeMessage = exports.formatTimestamp = exports.generateId = void 0;
// ユニークIDを生成
const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
exports.generateId = generateId;
// 日時フォーマット
const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
};
exports.formatTimestamp = formatTimestamp;
// メッセージをサニタイズ（XSS対策）
const sanitizeMessage = (content) => {
    return content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
};
exports.sanitizeMessage = sanitizeMessage;
// ユーザー名バリデーション
const validateUserName = (name) => {
    return name.trim().length >= 2 && name.trim().length <= 20;
};
exports.validateUserName = validateUserName;
