import { create } from 'zustand';
// using the zustand for the global state management but can we use redux(redux-thunx)

const useGlobal = create((set) => ({
    
    //-----------------------
    
    // Authentication

    authenticated : false,
    user : {},

    login: (user) => {
        set((state) => ({
            authenticated: true, 
            user: user
        }))
    },

    logout: () => {
        set((state) => ({
            authenticated: false,
            user: {}
        }))
    }
}))

export default useGlobal;