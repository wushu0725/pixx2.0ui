/**
 *
 * http配置
 *
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import { serialize } from '@/util/util'
import store from '../store'
import { getStore } from '../util/store'
import { getToken } from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import { Message } from 'element-ui'
import 'nprogress/nprogress.css' // progress bar style
axios.defaults.timeout = 30000;
//返回其他状态吗
axios.defaults.validateStatus = function(status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
    showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    if (store.getters.access_token) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    const TENANT_ID = getStore({ name: 'tenantId' });
    if (TENANT_ID) {
        config.headers['TENANT_ID'] = TENANT_ID // 租户ID
    }
    //headers中配置serialize为true开启序列化
    if (config.methods === 'post' && config.headers.serialize) {
        config.data = serialize(config.data);
        delete config.data.serialize;
    }
    return config
}, error => {
    return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
    NProgress.done();
    const status = Number(res.status);
    const message = res.data.data || errorCode[status] || errorCode['default'];

    if (status === 401){
        store.dispatch('FedLogOut').then(() => {
            router.push({
                path: '/login'
            });
        })
    }
    if (status !== 200) {
        Message({
            message: message,
            type: 'error'
        })
        return Promise.reject(new Error(message))
    }
    return res;
}, error => {
    NProgress.done()
    return Promise.reject(new Error(error))
})

export default axios
