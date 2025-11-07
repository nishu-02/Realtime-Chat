// API Configuration
export const API_BASE_URL = 'http://192.168.1.5:8000';
export const WS_BASE_URL = 'ws://192.168.1.5:8000';

// API Endpoints
export const ENDPOINTS = {
  SIGNIN: 'signin/',
  SIGNUP: 'signup/',
  CHAT: 'chat/',
};

// WebSocket Sources
export const WS_SOURCES = {
  FRIEND_LIST: 'friend.list',
  FRIEND_NEW: 'friend.new',
  MESSAGE_LIST: 'message.list',
  MESSAGE_SEND: 'message.send',
  MESSAGE_TYPE: 'message.type',
  MESSAGE_READ: 'message.read',
  MESSAGE_DELETE: 'message.delete',
  REQUEST_ACCEPT: 'request.accept',
  REQUEST_CONNECT: 'request.connect',
  REQUEST_LIST: 'request.list',
  SEARCH: 'search',
  THUMBNAIL: 'thumbnail',
  LAST_SEEN: 'last.seen',
};

// Color Themes
export const LIGHT_THEME = {
  primary: '#4F46E5',
  secondary: '#4B7BEC',
  background: '#F8F9FB',
  card: '#FFFFFF',
  border: '#E0E0E0',
  text: {
    primary: '#202020',
    secondary: '#606060',
    tertiary: '#909090',
    light: '#B0B0B0',
  },
  status: {
    online: '#10B981',
    away: '#F59E0B',
    offline: '#6B7280',
  },
  message: {
    me: '#4B7BEC',
    meGradient: ['#4B7BEC', '#3867D6'],
    friend: '#E4E6EB',
    friend_text: '#202020',
  },
  shadow: {
    color: '#000000',
    opacity: 0.08,
  },
};

export const DARK_THEME = {
  primary: '#6366F1',
  secondary: '#818CF8',
  background: '#0F172A',
  card: '#1E293B',
  border: '#334155',
  text: {
    primary: '#F1F5F9',
    secondary: '#CBD5E1',
    tertiary: '#94A3B8',
    light: '#64748B',
  },
  status: {
    online: '#10B981',
    away: '#F59E0B',
    offline: '#6B7280',
  },
  message: {
    me: '#4B7BEC',
    meGradient: ['#4B7BEC', '#3867D6'],
    friend: '#334155',
    friend_text: '#F1F5F9',
  },
  shadow: {
    color: '#000000',
    opacity: 0.3,
  },
};

// Message Status
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  DELETED: 'deleted',
};

// Typing Indicator Timeout (ms)
export const TYPING_TIMEOUT = 10000;

// Last Seen Time Thresholds
export const LAST_SEEN = {
  JUST_NOW: 1000 * 60, // 1 minute
  MINUTES: 1000 * 60 * 60, // 60 minutes
  HOURS: 1000 * 60 * 60 * 24, // 24 hours
};

export default {
  API_BASE_URL,
  WS_BASE_URL,
  ENDPOINTS,
  WS_SOURCES,
  LIGHT_THEME,
  DARK_THEME,
  MESSAGE_STATUS,
  TYPING_TIMEOUT,
  LAST_SEEN,
};
