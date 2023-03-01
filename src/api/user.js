import request from '@/utils/request'

// 封装登录的API方法
export function loginAPI (data) {
  return request({
    method: 'POST',
    url: '/auth/login',
    data: data
  })
}
// 获取折线图使用数据
export function getDataAPI () {
  return request.get('/analysis/DailyVisitTrend')
}
// 封装用户的API方法
export function userInfoAPI () {
  return request.get('/auth/currentUser')
}
