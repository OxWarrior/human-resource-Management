import request from '@/utils/request'

/**
 * @description 获取组织架构部门列表
 * @returns Promise
 */
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}
