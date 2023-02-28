import request from '@/utils/request'

// 封装登录的API
export function loginAPI (data) {
  return request({
    method: 'POST',
    url: '/auth/login',
    data: data
  })
}

// 获取登录人员相关信息
export function userInfoAPI () {
  return request.get('/auth/currentUser')
}

// 获取统计数据
export function getDataAPI () {
  return request.get('/analysis/DailyVisitTrend')
}
