import axios from 'axios'
const request = axios.create({
    baseURL: 'http://localhost:8088',
    timeout: 10000,
})

// response interceptors
request.interceptors.response.use(response => {
    if (response.data && response.data.status === 200) {
        return {
            status: response.data.status,
            data: response.data.data
        }
    }
    return {
        status: response.data.status,
        msg: res.data.msg,
        data: null 
    }
}, error => {
    console.error("response interceptors: ", error)
    return Promise.reject(error)
})

// request interceptors
request.interceptors.request.use(config => {
    config.withCredentials = true
    return {
        ...config,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        }
    }
}, error => {
    console.error("request interceptors: ", error)
    return Promise.reject(error)
})

export default request