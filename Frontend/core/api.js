import axios from 'axios';
// creating the axios instance to wrap the fucntionalities(nishu_02)

const api = axios.create({
    // base URL for all the requests
    baseURL: 'http://192.168.0.102:5000/main/', // so we dont have to make the api requests every single time
    headers: {
        'Content-Type': 'application/json', // all the data is json
    }
})

export default api;