import { create } from 'zustand'; // using the zustand for the global state management but can we use redux(redux-thunx)
import secure from './secure'; // importing the secure function from the secure file
const useGlobal = create((set) => ({
    
    //-----------------------
    
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