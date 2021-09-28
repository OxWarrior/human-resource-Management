import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: () => ({
    routes: constantRoutes
  }),
  mutations: {
    setRoutes(state, asyncRoutes) {
      state.routes = [...constantRoutes, ...asyncRoutes]
    }
  }
}
