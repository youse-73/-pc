import router from '@/router'
import axios from 'axios'
import { Message } from 'element-ui'

//
const request = axios.create({
  baseURL: 'http://interview-api-t.itheima.net'
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers.Authorization =
      'Bearer ' + localStorage.getItem('mj-pc-token')
    return config
  },
  // 对请求错误做些什么
  error => Promise.reject(error)
)

// 添加响应拦截器
request.interceptors.response.use(
  // 成功的情况下，直接返回服务器返回的data,后面就不用解构了
  response => response.data,
  // function (response) {
  //   // 2xx 范围内的状态码都会触发该函数。
  //   // 对响应数据做点什么
  //   return response
  // },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // error.response.data表示响应结果
    // error,response,status表示响应状态码
    if (error.response) {
      if (error.response.status === 401) {
        Message.error('身份认证失败，请重新登录！')
        localStorage.removeItem('mj-pc-token')
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
