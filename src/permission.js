import router, { asyncRoutes } from '@/router'
import store from '@/store'

// 引入进度条组件
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入设置标题
import getPageTitle from '@/utils/get-page-title'

// 路由白名单
const whiteLists = ['/login', '/404']

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  nProgress.start()
  const token = store.state.user.token
  if (token) { // 如果有token
    if (to.path === '/login') {
      next('/') // 如果跳转login定位到主页
    } else {
      if (!store.getters.userId) { // 当前没有用户信息 id
        // 有token 调action 获取用户信息
        const menus = await store.dispatch('user/getUserInfo')

        // 筛选所有动态路由中包含登录信息中的菜单路由显示权限
        const filterRoutes = asyncRoutes.filter(route => {
          const routeName = route.children[0].name // 路由对象的name值包含在动态路由中返回
          return menus.includes(routeName)
        })
        // 加入动态路由后再添加404页面，否则会刷新跳转404，因为还没有添加路由访问不到
        filterRoutes.push({ path: '*', redirect: '/404', hidden: true })

        // 添加动态路由
        router.addRoutes(filterRoutes)
        // 将动态路由添加到vuex中供sidebar显示
        store.commit('permission/setRoutes', filterRoutes)

        // 获取所有能去de 路由路径
        const allPath = store.state.permission.routes.map(item => item.path)

        // 跳转员工详情时，直接获取完整路径信息
        if (to.path === '/employees/detail') {
          next({
            path: to.fullPath
          })
        } else {
          // 在添加动态路由之前，vue-router是不知道去哪儿的，需要手动告知
          next({
            path: allPath.includes(to.path) ? to.path : '/'
            // replace: true // 重进一次, 不保留重复历史
          })
        }
      }
      next() // 否则放行
    }
  } else { // 没有token
    if (whiteLists.includes(to.path)) {
      next() // 包含在白名单中放行
    } else {
      next('/login') // 不包含在白名单跳转到登录页
    }
  }
  nProgress.done()
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  next()
})

// 路由后置守卫 前后路由一致，不会触发路由后置守卫
router.afterEach((to, from) => {
  // 关闭进度条
  nProgress.done()
})
