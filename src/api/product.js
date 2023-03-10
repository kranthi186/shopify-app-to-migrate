import request from '@/utils/request'

export function getProduct (id) {
  return request({
    url: `/products/${id}`,
    method: 'get'
  })
}
