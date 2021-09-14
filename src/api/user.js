import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'POST',
    url: '/api/sys/login'
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
