import axios from 'axios';
import { Platform } from 'react-native';
import { API_BASE_URL } from './constants';

// creating the axios instance to wrap the functionalities (nishu_02)

const DEFAULT_LOCAL_IP = '192.168.1.3';

export const ADDRESS = Platform.select({
    ios: `http://10.0.2.2:8000`,
    android: API_BASE_URL,
    default: API_BASE_URL,
});

const api = axios.create({
    // base URL for all the requests
    baseURL: `${ADDRESS}/main/`, // so we don't have to include /main/ every time
    headers: {
        'Content-Type': 'application/json', // all the data is json
    },
});

export default api;