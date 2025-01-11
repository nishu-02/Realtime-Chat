import { create } from 'zustand';
import secure from './secure';
import api from './api'; 
import utils from './utils';


// Socket receive message handling

function responseThumbnail(set, get, data) {
  set((state) => ({
    user: data
  }))
}

const useGlobal = create((set,get) => ({
  initialized: false,
  
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
  authenticated: false,
  tokens: {},
  user: {},


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
  socket: null,


  socketConnect: async () => {
    const tokens = await secure.get('tokens');
    if (!tokens || !tokens.access) {
      console.error('No tokens found.');
      return;
    }

    const socketUrl = `ws://192.168.1.3:5000/chat/?token=${tokens.access}`;
    console.log('WebSocket URL:', socketUrl);

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      // console.log('Received message:', event.data);
      
      // convert data to js object
      const parsed = JSON.parse(event.data)

      // log to format the data
      utils.log('onmessage', parsed);

      // map function to keys
      const response = {
        'thumbnail': responseThumbnail
      }

      const resp = response[parsed.source]
      if(!resp) {
        utils.log('parsed.source ' + parsed.source + ' not found')
        return
      }

      // Call response function
      resp(set, get, parsed.data)
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

  uploadThumbnail: (file) =>{
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'thumbnail',
      base64: file.base64,
      filename: file.fileName
    }));
  }


}));

export default useGlobal;
