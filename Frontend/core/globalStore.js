import { create } from 'zustand';
import secure from './secure'; // Secure functions for storing tokens and credentials
import api from './api'; // API setup for making HTTP requests
import utils from './utils'; // Assuming you have utility functions
import { ADDRESS } from './api'; // Base API address

const useGlobal = create((set) => ({
  initialized: false,
  authenticated: false,
  user: {},
  tokens: {},
  socket: null,

  //------------------------//
  // Initialization

  init: async () => {
    const credentials = await secure.get('credentials');
    console.log('Fetched credentials:', credentials);

    if (!credentials || !credentials.username || !credentials.password) {
      console.error('Invalid credentials:', credentials);
      return;
    }

    try {
      console.log("Making request to:", api.defaults.baseURL + 'signin/');
      const response = await api.post('signin/', {
        username: credentials.username,
        password: credentials.password,
      });

      console.log('API Response:', response.data);

      if (response.status !== 200) {
        throw new Error('Authentication error');
      }

      const user = response.data.user;
      const tokens = response.data.tokens;

      // Store user and tokens securely
      await secure.set('user', user);
      await secure.set('tokens', tokens);

      set((state) => ({
        initialized: true,
        authenticated: true,
        user: user,
        tokens: tokens,
      }));
    } catch (error) {
      console.log('useGlobal.init error:', error);
    }
  },

  //------------------------//
  // Authentication

  login: async (credentials, user, tokens) => {
    console.log('Storing username:', user.username);

    await secure.set('credentials', {
      username: user.username,
      password: credentials.password,
    });
    await secure.set('tokens', tokens);
    await secure.set('username', user.username);

    set((state) => ({
      authenticated: true,
      user: user,
      tokens: tokens,
    }));
  },

  logout: async () => {
    await secure.wipe();
    set((state) => ({
      authenticated: false,
      user: {},
      tokens: {},
    }));
  },

  //------------------------//
  // WebSocket

  socketConnect: async () => {
    const tokens = await secure.get('tokens');
    if (!tokens || !tokens.access) {
      console.error('No tokens found.');
      return;
    }

    const socketUrl = `ws://192.168.0.102:5000/chat/?token=${tokens.access}`;
    console.log('WebSocket URL:', socketUrl);

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    socket.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    set((state) => ({
      socket,
    }));
  },

  socketClose: () => {
    set((state) => {
      if (state.socket) {
        state.socket.close();
        console.log('Socket manually closed');
      } else {
        console.log('No open WebSocket connection to close');
      }
      return { socket: null };
    });
  },
}));

export default useGlobal;
