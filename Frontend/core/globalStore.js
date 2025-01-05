import { create } from 'zustand'; // using the zustand for the global state management but can we use redux(redux-thunx)

import secure from './secure'; // importing the secure function from the secure file
import api from './api';

const useGlobal = create((set) => ({
    
    //-----------------------//
    // Intialization

    intialized = false,
    // also can use the promises 
    init: async () => {
        const credentails = await secure.get('credentials');
        if( credentials ){
            try {
                const response = await api({
                    method: "POST", // the method
                    url: '/main/signin/',
                    data: {
                      username: credentials.username,
                      password: credentials.password,
                    }
                })
                
                if(!response.status !== 200) {
                    throw 'Authentication error'
                }

                const user = response.data.user;
                set((state) => ({
                    intialized: true,
                    authenticated: true, 
                    user: user
                }))
                return
            } catch (error) {
                console.log('useGlobalinit:', error);

            }           
        }
    },
    
    // Authentication

    authenticated : true,
    user : {},

    login: (credentials, user) => {
        secure.set('credentails', credentials);
        set((state) => ({
            authenticated: true, 
            user: user
        }))
    },

    logout: () => {
        secure.wipe()
        set((state) => ({
            authenticated: false,
            user: {}
        }))
    }
}))

export default useGlobal;