// 引入token方法
import { setToken, getToken, removeToken } from '@/utils/auth'
// 引入登录接口
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 引入重置路由方法
import { resetRouter } from '@/router'

const state = {
  token: getToken() || null, // 用户token
  userInfo: {} // 用户信息
}

const mutations = {
  // 设置token
  setToken(state, newToken) {
    state.token = newToken
    // 调auth中的方法本地存储token(cookie中)
    setToken(state.token)
  },
  // 移除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 移除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 用户登录
  async userLogin(context, params) {
    const res = await login(params)
    // console.log(res)
    // 调用mutation方法对token赋值
    // console.log(context)
    context.commit('setToken', res.data)
  },
  // 获取用户信息
  async getUserInfo(context) {
    const res = await getUserInfo()
    const resp = await getUserDetailById(res.data.userId)
    // console.log(resp)
    context.commit('setUserInfo', { ...res.data, ...resp.data })

    return res.data.roles.menus
  },
  // 退出登录
  userLogout(context) {
    // 清空token和userInfo
    context.commit('removeToken')
    context.commit('removeUserInfo')

    // 退出重置路由，避免重复添加路由,vue-element-admin提供
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

