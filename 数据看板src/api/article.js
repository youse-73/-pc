import request from '@/utils/request'

// 封装获取面经列表的方法
export function articleListAPI (params) {
  return request({
    url: '/admin/interview/query',
    params: params
  })
}

// 添加面经的方法
export function addArticleAPI (data) {
  return request.post('/admin/interview/create', data)
}

// 获取单个面经详情
export function articleAPI (id) {
  return request({
    url: '/admin/interview/show',
    params: { id: id }
  })
}

// 更新数据的方法
export function updateArticleAPI (data) {
  return request({
    method: 'PUT',
    url: '/admin/interview/update',
    data: data // { id, stem, content }
  })
}
