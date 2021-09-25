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

/**
 * @description 根据id删除员工
 * @param {*} id 员工id
 * @returns
 */
export function deleteEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * @description 新增员工
 * @param {*} data
 * @returns
 */
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/**
 * @description 批量导入员工
 * @param {*} data
 * @returns
 */
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}

/**
 * @description 获取员工基本信息
 * @param {*} id
 * @returns
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

/**
 * @description 保存员工基本信息
 * @param {*} data
 * @returns
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}
