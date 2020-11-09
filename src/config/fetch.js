import axios from 'axios';
import qs from 'qs';
// axios 配置
axios.defaults.timeout = 300000;
axios.defaults.baseURL = 'http://localhost:3001/'

// http request 拦截器
axios.interceptors.request.use(
    config => {
        config.data = qs.stringify(config.data);
        config.headers = {
            'Content-Type':'application/x-www-form-urlencoded'
        };
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);


// http response 拦截器
axios.interceptors.response.use(
    response => {
        if(response.data.errCode == 2) {
            router.push({
                path: '/',
                query: {redirect: router.currentRoute.fullPath}  //从哪个页面跳转
            })
        }
        if (response.headers.file_name) {
            return {
                data: {
                    fileName: decodeURI(response.headers.file_name),
                    data: response.data
                }
            }
        } else {
            return response;
        }
    },
    error => {
        return Promise.reject(error.response.data)
    }
);

export default axios;

/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function fetch(url, params = {}) {

    return new Promise((resolve, reject) => {
            axios.get(url, {
            params: params
        }).then(response => {
            resolve(response.data);
            }).catch(err => {
            reject(err)
        })
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data) {
    return new Promise((resolve, reject) => {
            axios.post(url, data)
            .then(response => {
            resolve(response.data);
    }, err => {
        reject(err);
    })
})
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
            axios.patch(url, data)
            .then(response => {
            resolve(response.data);
    }, err => {
        reject(err);
    })
})
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
            axios.put(url, data)
            .then(response => {
            resolve(response.data);
    }, err => {
        reject(err);
    })
})
}
