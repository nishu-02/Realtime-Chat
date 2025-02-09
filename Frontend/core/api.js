import axios from 'axios';
// creating the axios instance to wrap the fucntionalities(nishu_02)

export const ADDRESS = 'https://realtime-chat-ye3n.onrender.com';
const api = axios.create({
    // base URL for all the requests
    baseURL: 'https://realtime-chat-ye3n.onrender.com/main/', // so we dont have to make the api requests every single time
    headers: {
        'Content-Type': 'application/json', // all the data is json
    }
})

export default api;