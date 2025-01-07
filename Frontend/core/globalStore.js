import { create } from 'zustand'; // using the zustand for the global state management but can we use redux(redux-thunx)

import secure from './secure'; // importing the secure function from the secure file
import api from './api';

const useGlobal = create((set) => ({
    initialized: false,
    authenticated : false,
    user : {},
    
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
                console.log("Making request to: ", api.defaults.baseURL + 'main/signin/');
    
                const response = await api.post('signin/', {
                    username: credentials.username,
                    password: credentials.password,
                });
                
                console.log('API Response:', response.data);
    
                if (response.status !== 200) {
                    throw 'Authentication error';
                }
    
                const user = response.data.user;
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

   

    login: (user, tokens) => {
        secure.set('credentials', {
          username: user.username,
          password: user.password,
        });
        secure.set('tokens', tokens); // Store the tokens as well
        set((state) => ({
          authenticated: true,
          user: user,
          tokens: tokens,  // Store tokens in state
        }));
      },
      

    logout: () => {
        secure.wipe();
        set((state) => ({
            authenticated: false,
            user: {},
        }))
    }
}))

export default useGlobal;