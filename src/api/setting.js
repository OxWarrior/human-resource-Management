import request from '@/utils/request'

/**
 * @description 获得所有角色列表
 * @param {page , pagesize}
 * @returns
 */
export function getRoles(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

/**
 * @description 根据id查询企业
 * @param {id} 企业id
 * @returns
 */
export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`,
    method: 'GET'
  })
}

/**
 * @description 添加角色
 * @param {name,description}
 * @returns
 */
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 * @description 根据ID获取角色详情
 * @param {id} 角色id
 * @returns
 */
export function getRoleId(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

/**
 * @description 根据ID更新角色
 * @param {*} data
 * @returns
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * @description 根据ID删除角色
 * @param {*} id 角色id
 * @returns
 */

export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
