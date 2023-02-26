import request from '@/utils/request'

export const loginAPI = data => {
  return request.post('/auth/login', data)
}

export function userInfoAPI () {
  return request.get('/auth/currentUser')
}
