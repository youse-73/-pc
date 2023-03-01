import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'

// 配置请求根路径
const request = axios.create({
  baseURL: 'http://interview-api-t.itheima.net'
})
// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // config.headers.Authorization =
    //   'Bearer ' + localStorage.getItem('mj-pc-token')
    config.headers.Authorization = 'Bearer ' + store.state.user.token
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  request => request.data,
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // error.response.data表示响应结果
    // error,response,status表示响应状态码
    if (error.response) {
      if (error.response.status === 401) {
        Message.error('身份认证失败')
        // localStorage.removeItem('mj-pc-token')
        store.commit('user/updateToken', '')
        router.push('/login')
      } else {
        Message.error(error.response.data.Message)
      }
    }
    return Promise.reject(error)
  }
)
// 导出
export default request
