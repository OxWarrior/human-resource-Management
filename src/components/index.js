import PageTools from '@/components/PageTools'

// 将所有的组件添加进数组中
const components = [
  PageTools
]

export default {
  install(Vue) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
