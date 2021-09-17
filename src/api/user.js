import request from '@/utils/request'

/**
  * @description 登录
  * @returns
  */
export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

export function getInfo(token) {
  return request({

  })
}

export function logout() {
  return request({

  })
}

/**
 * @description 获取用户资本资料
 * @returns
 */
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

/**
 * @description 获取员工的基本信息
 * @param {Number} id 用户id
 * @returns
 */
export function getUserDetailById(id) {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}
