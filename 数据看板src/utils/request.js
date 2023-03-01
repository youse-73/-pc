import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import axios from 'axios'

// 创建axios的实例（克隆一份axios）
const request = axios.create({
  baseURL: 'http://interview-api-t.itheima.net/'
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // config.headers.Authorization = 'Bearer ' + localStorage.getItem('mj-pc-token')
    config.headers.Authorization = 'Bearer ' + store.state.user.token
    return config
  },
  error => Promise.reject(error)
)

// 添加响应拦截器
request.interceptors.response.use(
  // 成功的情况下，直接返回服务器返回的结果，即 response.data
  response => response.data,
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // error.response.data 表示响应结果
    // error.response.status表示响应状态码
    if (error.response) {
      if (error.response.status === 401) {
        // 如果状态码是401，提示错误信息，并跳转到登录页（还可以选择把过期的token移除掉）
        Message.error('身份认证失败，请重新登录')
        // localStorage.removeItem('mj-pc-token')
        store.commit('user/updateToken', '')
        router.push('/login')
      } else {
        // 提示错误信息
        Message.error(error.response.data.message)
      }
    }

    return Promise.reject(error)
  }
)

export default request
