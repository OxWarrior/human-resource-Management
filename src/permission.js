import router from '@/router'
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
      // 有token 调action
      await store.dispatch('user/getUserInfo')
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
