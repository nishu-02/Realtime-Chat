import { create } from 'zustand'; // using the zustand for the global state management but can we use redux(redux-thunx)

import secure from './secure'; // importing the secure function from the secure file
import api from './api';
import utils from './utils';
import { ADDRESS } from './api';

const useGlobal = create((set) => ({


    initialized: false,
    authenticated: false,
    user: {},

    //-----------------------//
    // Intialization

    // also can use the promises 
    init: async () => {
        const credentials = await secure.get('credentials');
        console.log('Fetched credentials:', credentials);

        if (!credentials || !credentials.username || !credentials.password) {
            console.error('Invalid credentials:', credentials);
            return;
        }
        if (credentials) {
            try {
                // Log the base URL for debugging
                console.log("Making request to: ", api.defaults.baseURL + 'signin/');

                const response = await api.post('signin/', {
                    username: credentials.username,
                    password: credentials.password,
                });

                console.log('API Response:', response.data);

                if (response.status !== 200) {
                    throw 'Authentication error';
                }

                const user = response.data.user;
                const tokens = response.data.tokens;

                set((state) => ({
                    initialized: true,
                    authenticated: true,
                    user: user,
                }));
            } catch (error) {
                console.log('useGlobal.init error:', error);
            }
        } else {
            console.log('No credentials found');
        }
    },

    // Authentication
    login: (credentials, user, tokens) => {
        console.log('Storing username:', user.username); // Debugging log
        secure.set('credentials', {
            username: user.username,
            password: credentials.password, // Use the original password
        });
        secure.set('tokens', tokens);
        secure.set('username', user.username); // Ensure username is stored here
        set((state) => ({
            authenticated: true,
            user: user,
            tokens: tokens,
        }));
    },


    logout: () => {
        secure.wipe();
        set((state) => ({
            authenticated: false,
            user: {},
        }))
    },


    //WebSocket

    // as the websocket will receive the data we need to change the global state as well

    socket: null,

    socketConnect: async () => {
        let user = await secure.get('username');
        if (!user) {
            console.log('No username found in "username" key. Checking "credentials"...');
            const credentials = await secure.get('credentials');
            user = credentials?.username;
        }
    
        if (!user) {
            console.log('No username found!');
            return;
        }
    
        console.log('Retrieved username:', user);
        const socketUrl = `ws://192.168.0.102:5000/chat/?username=${encodeURIComponent(user)}`;
        console.log("WebSocket URL:", socketUrl);
    
        const socket = new WebSocket(socketUrl);
    
        socket.onopen = () => {
            console.log('WebSocket connected');
        };
    
        socket.onmessage = (event) => {
            console.log('Received message:', event.data);
        };
    
        socket.onerror = (e) => {
            console.log('WebSocket error:', e.message);
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
    

}))

export default useGlobal;