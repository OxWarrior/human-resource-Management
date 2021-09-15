// 引入token方法
import { setToken, getToken } from '@/utils/auth'
// 引入登录接口
import { login } from '@/api/user'

const state = {
  token: getToken() || null
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

