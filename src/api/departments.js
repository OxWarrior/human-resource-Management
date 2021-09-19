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

/**
 * @description 获取员工简单列表
 * @returns Promise
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

/**
 * @description 新增部门
 * @param {object} data 发送参数： name, code, manager, introduce, pid
 * @param {object} data 发送参数： 部门名称, 部门编码, 部门管理者, 部门介绍, 新增的这个子部门的上级部门
 * @returns Promise
 */
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

/**
 * @description 根据ID查询部门详情
 * @param {string} id 部门id
 * @returns Promise
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

/**
 * @description 根据ID修改部门详情
 * @param {*} data 部门详情
 * @returns Promise
 */
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * @description 根据ID删除部门
 * @param {string} id 部门id
 * @returns Promise
 */
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
