import request from '@/utils/request'

/**
 * 获取员工列表
 * @param {*} params
 * @returns
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

