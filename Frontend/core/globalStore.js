import { create } from 'zustand';
import secure from './secure';
import api from './api';
import utils from './utils';
import { WS_BASE_URL, WS_SOURCES } from './constants';

// Initial state definition
const initialState = {
  initialized: false,
  authenticated: false,
  tokens: {},
  user: {},
  socket: null,
  searchList: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 10,
  reconnectDelay: 3000, // 3 seconds
  reconnectTimer: null,
  socketConnecting: false,
};

// Socket receive message handling

function responseFriendList(set, get, friendList) {
  set((state) => ({
    friendList: friendList
  }))
}

function responseFriendNew(set, get, friend) {
  const currentList = get().friendList || [];
  
  // Check if friend already exists in the list
  const existingIndex = currentList.findIndex(
    f => f.id === friend.id || f.friend.username === friend.friend.username
  );
  
  if (existingIndex >= 0) {
    // Update existing friend instead of adding duplicate
    const updatedList = [...currentList];
    updatedList[existingIndex] = friend;
    set((state) => ({
      friendList: updatedList
    }));
  } else {
    // Add new friend to the top of the list
    const friendList = [friend, ...currentList];
    set((state) => ({
      friendList: friendList
    }));
  }
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
    messagesTyping: new Date()
  }))
}

function responseRequestAccept(set, get, connection) {
  const user = get().user
  // If I was the one that accepted the request, remove the request from the list

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
  // If the corresponding user is contained within the searchList, update the state of the searchList item
  const sl = get().searchList
  if (sl === null) {
    return
  }
  const searchList = [...sl]

  let searchIndex = -1;
  // Determine which user to look for in the search list
  let usernameToFind = '';
  
  // If I (receiver) accepted the request, look for the sender
  if (user.username === connection.receiver.username) {
    usernameToFind = connection.sender.username
  } else {
    // If I (sender) had my request accepted, look for the receiver
    usernameToFind = connection.receiver.username
  }

  searchIndex = searchList.findIndex(
    item => item.username === usernameToFind
  )

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

function responseMessageRead(set, get, data) {
  // Update the message in the messagesList with the new read status
  const messagesList = get().messagesList || [];
  const updatedList = messagesList.map(msg => {
    if (msg.id === data.message.id) {
      return data.message; // Replace with updated message from server
    }
    return msg;
  });

  set((state) => ({
    messagesList: updatedList
  }));
}

function responseMessageDelete(set, get, data) {
  // Update the message in the messagesList with the deleted status
  const messagesList = get().messagesList || [];
  const updatedList = messagesList.map(msg => {
    if (msg.id === data.message.id) {
      return data.message; // Replace with updated message from server
    }
    return msg;
  });

  set((state) => ({
    messagesList: updatedList
  }));
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
    const state = get();
    
    // Prevent multiple simultaneous connection attempts
    if (state.socketConnecting) {
      console.log('Connection already in progress');
      return;
    }

    set({ socketConnecting: true });

    const tokens = await secure.get('tokens');
    if (!tokens || !tokens.access) {
      console.error('No tokens found.');
      set({ socketConnecting: false });
      return;
    }

    const socketUrl = `${WS_BASE_URL}/chat/?token=${tokens.access}`;
    console.log('WebSocket URL:', socketUrl);

    try {
      const socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        set({ 
          reconnectAttempts: 0,
          socketConnecting: false
        });
        socket.send(JSON.stringify({
          source: WS_SOURCES.REQUEST_LIST
        }))
        socket.send(JSON.stringify({
          source: WS_SOURCES.FRIEND_LIST
        }))
      };

      socket.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        utils.log('onmessage', parsed);
        console.log('WebSocket received:', parsed);

        const responses = {
          [WS_SOURCES.FRIEND_LIST]: responseFriendList,
          [WS_SOURCES.FRIEND_NEW]: responseFriendNew,
          [WS_SOURCES.MESSAGE_LIST]: responseMessageList,
          [WS_SOURCES.MESSAGE_SEND]: responseMessageSend,
          [WS_SOURCES.MESSAGE_TYPE]: responseMessageType,
          [WS_SOURCES.MESSAGE_READ]: responseMessageRead,
          [WS_SOURCES.MESSAGE_DELETE]: responseMessageDelete,
          [WS_SOURCES.REQUEST_ACCEPT]: responseRequestAccept,
          [WS_SOURCES.REQUEST_CONNECT]: responseRequestConnect,
          [WS_SOURCES.REQUEST_LIST]: responseRequestList,
          [WS_SOURCES.SEARCH]: responseSearch,
          [WS_SOURCES.THUMBNAIL]: responseThumbnail
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

      socket.onclose = (event) => {
        console.log('WebSocket closed. Code:', event.code, 'Reason:', event.reason);
        set({ socketConnecting: false });
        
        // Attempt to reconnect if not manually closed
        const state = get();
        if (event.code !== 1000 && state.reconnectAttempts < state.maxReconnectAttempts) {
          const nextAttempt = state.reconnectAttempts + 1;
          const delay = state.reconnectDelay * Math.pow(1.5, state.reconnectAttempts);
          
          console.log(`Reconnecting (attempt ${nextAttempt}/${state.maxReconnectAttempts}) in ${Math.round(delay / 1000)}s...`);
          
          set({ reconnectAttempts: nextAttempt });
          
          const timer = setTimeout(() => {
            get().socketConnect();
          }, delay);
          
          set({ reconnectTimer: timer });
        } else if (state.reconnectAttempts >= state.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
        }
      };

      set({ socket });
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      set({ socketConnecting: false });
    }
  },

  socketClose: () => {
    set((state) => {
      // Clear any pending reconnection timers
      if (state.reconnectTimer) {
        clearTimeout(state.reconnectTimer);
      }
      
      if (state.socket) {
        state.socket.close(1000); // Close with code 1000 (normal closure)
        console.log('Socket manually closed');
      } else {
        console.log('No open WebSocket connection to close');
      }
      
      return { 
        socket: null,
        reconnectAttempts: 0,
        reconnectTimer: null,
        socketConnecting: false
      };
    });
  },

  searchUsers: (query) => {
    if (query) {
      const socket = get().socket
      socket.send(JSON.stringify({
        source: WS_SOURCES.SEARCH,
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
        messagesUsername: null
      }))
    } else {
      set((state) => ({
        messagesNext: null,
      }))
    }
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: WS_SOURCES.MESSAGE_LIST,
      connectionId: connectionId,
      page: page
    }))
  },

  messageSend: (connectionId, message) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: WS_SOURCES.MESSAGE_SEND,
      connectionId: connectionId,
      message: message
    }))
  },

  messageType: (username) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: WS_SOURCES.MESSAGE_TYPE,
      username: username
    }))
  },


  requestList: null,

  requestAccept: (username) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: WS_SOURCES.REQUEST_ACCEPT,
      username: username,
    }));
  },

  requestConnect: (username) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: WS_SOURCES.REQUEST_CONNECT,
      username: username,
    }));
  },

  messageDelete: (messageId) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: WS_SOURCES.MESSAGE_DELETE,
      messageId: messageId,
    }));
  },

  messageRead: (messageId) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: WS_SOURCES.MESSAGE_READ,
      messageId: messageId,
    }));
  },

  uploadThumbnail: (file) => {
    const socket = get().socket;
    socket.send(JSON.stringify({
      source: WS_SOURCES.THUMBNAIL,
      base64: file.base64,
      filename: file.fileName
    }));
  }
}));

export default useGlobal;