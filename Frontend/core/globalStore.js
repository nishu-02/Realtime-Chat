import { create } from 'zustand';
import secure from './secure';
import api from './api';
import utils from './utils';

// Initial state definition
const initialState = {
  initialized: false,
  authenticated: false,
  tokens: {},
  user: {},
  socket: null,
  searchList: null
};

// Socket receive message handling

function responseFriendList(set, get, friendList) {
  set((state) => ({
    friendList: friendList
  }))
}

function responseFriendNew(set, get, friend) {
  
  const friendList = [friend, ...get().friendList]

  set((state) => ({
    friendList: friendList
  }))
}

function responseMessageList(set, get, data) {
  set((state) => ({
    messagesList: [...get().messagesList, ...data.messages],
    messagesNext: data.next,
    messagesUsername: data.friend.username
  }));
}

function responseMessageSend(set, get, data) {
  const username = data.friend.username;

  // Create a new friendList array
  const friendList = [...get().friendList];
  const friendIndex = friendList.findIndex(
    item => item.friend.username === username
  );

  if (friendIndex >= 0) {
    // Create a new item object instead of modifying the existing one
    const oldItem = friendList[friendIndex];
    const newItem = {
      ...oldItem,
      preview: data.message.text,
      updated: data.message.created
    };
    
    // Remove old item and insert new item
    friendList.splice(friendIndex, 1);
    friendList.unshift(newItem);
    
    set((state) => ({
      friendList: friendList
    }));
  }

  // If the message data doesn't belong to this friend, don't update the message list
  if (username !== get().messagesUsername) {
    return;
  }

  // Create new message list with the new message
  const messageList = [data.message, ...get().messagesList];
  set((state) => ({
    messagesList: messageList
  }));
}

function responseMessageType(set, get, data) {
  if (data.username !== get().messagesUsername) return

  set((state) => ({
    messagesTyping: new Data()
  }))
}

function responseRequestAccept(set, get, connection) {
  const user = get().user
  // If I was the one the accepted the request, remove the request from the list

  if (user.username === connection.receiver.username) {
    const requestList = [...get().requestList]
    const requestIndex = requestList.findIndex(
      request => request.id === connection.id
    )
    if (requestIndex >= 0) {
      requestList.splice(requestIndex, 1)
      set((state) => ({
        requestList: requestList
      }))
    }
  }
  // If the corresponding user is  contained within the searcLsit for the acceptor, update the state of the searchList item
  const sl = get().searchList
  if (sl === null) {
    return
  }
  const searchList = [...sl]

  let searchIndex = -1;
  // if the user is accepted
  if (user.username === connection.receiver.username) {
    searchIndex = searchList.findIndex(
      user => user.username === connection.receiver.username
    )
  } else {
    // if the other user accepted
    searchIndex = searchList.findIndex(
      user => user.username === connection.receiver.username
    )
  }

  if (searchIndex >= 0) {
    searchList[searchIndex].status = 'connected'
    set((state) => ({
      searchList: searchList
    }))
  }
}

function responseRequestConnect(set, get, connection) {
  const user = get().user
  // If i was the one that made the connect request, 
  // update the search list row
  if (user.username === connection.sender.username) {
    const searchList = [...get().searchList]
    const searchIndex = searchList.findIndex(
      request => request.username === connection.receiver.username
    )
    if (searchIndex >= 0) {
      searchList[searchIndex].status = 'pending-them'
      set((state) => ({
        searchList: searchList
      }))
    }
    // If they were the one  that sent the connect 
    // request, add request to request list
  } else {
    const requestList = [...get().requestList]
    const requestIndex = requestList.findIndex(
      request => request.sender.username === connection.sender.username
    )
    if (requestIndex === -1) {
      requestList.unshift(connection)
      set((state) => ({
        requestList: requestList
      }))
    }
  }
}

function responseRequestList(set, get, requestList) {
  set((state) => ({
    requestList: requestList
  }))
}

function responseSearch(set, get, data) {
  set((state) => ({
    searchList: data
  }))
}

function responseThumbnail(set, get, data) {
  set((state) => ({
    user: data
  }))
}

const useGlobal = create((set, get) => ({
  ...initialState,  // Spread the initial state

  init: async () => {
    const credentials = await secure.get('credentials');
    console.log('Fetched credentials:', credentials);

    if (!credentials || !credentials.username || !credentials.password) {
      console.error('Invalid credentials:', credentials);
      set({ initialized: true }); // Still mark as initialized even if credentials are invalid
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

      set({
        initialized: true,
        authenticated: true,
        user: user,
        tokens: tokens,
      });
    } catch (error) {
      console.log('useGlobal.init error:', error);
      set({ initialized: true });
    }
  },

  login: async (credentials, user, tokens) => {
    console.log('Storing username:', user.username);

    await secure.set('credentials', {
      username: user.username,
      password: credentials.password,
    });
    await secure.set('tokens', tokens);
    await secure.set('username', user.username);

    set({
      authenticated: true,
      user: user,
      tokens: tokens,
    });
  },

  logout: async () => {
    await secure.wipe();
    set({
      ...initialState,
      initialized: true
    });
  },

  socketConnect: async () => {
    const tokens = await secure.get('tokens');
    if (!tokens || !tokens.access) {
      console.error('No tokens found.');
      return;
    }

    const socketUrl = `wss://realtime-chat-ye3n.onrender.com/chat/?token=${tokens.access}`;
    console.log('WebSocket URL:', socketUrl);

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({
        source: 'request.list'
      }))
      socket.send(JSON.stringify({
        source: 'friend.list'
      }))
    };

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      utils.log('onmessage', parsed);
      console.log('WebSocket received:', parsed);

      const responses = {
        'friend.list': responseFriendList,
        'friend.new': responseFriendNew,
        'message.list': responseMessageList,
        'message.send': responseMessageSend,
        'message.type': responseMessageType,
        'requestAccept': responseRequestAccept,
        'request.connect': responseRequestConnect,
        'request.list': responseRequestList,
        'search': responseSearch,
        'thumbnail': responseThumbnail
      };

      const resp = responses[parsed.source];
      if (!resp) {
        utils.log('parsed.source ' + parsed.source + ' not found');
        return;
      }

      resp(set, get, parsed.data);
    };

    socket.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    set({ socket });
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

  searchUsers: (query) => {
    if (query) {
      const socket = get().socket
      socket.send(JSON.stringify({
        source: 'search',
        query: query
      }))
    } else {
      set((state) => ({
        searchList: null
      }))
    }
  },

  friendList: null,

  // Messages

  messagesList: [],
  messagesNext:null,
  messagesTyping: null,
  messagesUsername: null,


  messageList: (connectionId, page = 0) => {
    if (page === 0) {
      set((state) => ({
        messagesList: [],
        messagesNext: null,
        messagesTyping: null,
        messageUsername: null
      }))
    } else {
      set((state) => ({
        messagesNext: null,
      }))
    }
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: 'message.list',
      connectionId: connectionId,
      page: page
    }))
  },

  messageSend: (connectionId, message) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: 'message.send',
      connectionId: connectionId,
      message: message
    }))
  },

  messageType: (username) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: 'message.type',
      username: username
    }))
  },


  requestList: null,

  requestAccept: (username) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: 'request.accept',
      username: username,
    }));
  },

  requestConnect: (username) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: 'request.connect',
      username: username,
    }));
  },

  uploadThumbnail: (file) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: 'thumbnail',
      base64: file.base64,
      filename: file.fileName
    }));
  }
}));

export default useGlobal;