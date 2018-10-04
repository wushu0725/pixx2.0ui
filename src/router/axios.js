/**
 *
 * http配置
 *
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import router from '../router/router'
import store from '../store'
import { getToken } from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import { Message } from 'element-ui'
import 'nprogress/nprogress.css' // progress bar style
axios.defaults.timeout = 30000;
//返回其他状态吗
// axios.defaults.validateStatus = function(status) {
//     return status >= 200 && status < 500; // 默认的
// };
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
NProgress.configure({ showSpinner: false }) // NProgress Configuration
    //HTTPrequest拦截
axios.interceptors.request.use(config => {
        NProgress.start() // start progress bar
        if (store.getters.access_token) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
        }

        if (sessionStorage.getItem('tenantId')){
            config.headers['TENANT_ID'] =  sessionStorage.getItem('tenantId') // 租户ID
        }
        return config
    }, error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    })
    //HTTPresponse拦截
axios.interceptors.response.use(data => {
    NProgress.done();
    return data
}, error => {
    NProgress.done()
    let errMsg = error.toString()
    let code = errMsg.substr(errMsg.indexOf('code') + 5)
    Message({
        message: errorCode[code] || errorCode['default'],
        type: 'error'
    })
    if(parseInt(code) === 401 || parseInt(code) === 403){
        store.dispatch('FedLogOut').then(() => {
            router.push({ path: '/login' });
        })
    }
    return Promise.reject(new Error(error))

})

export default axios
