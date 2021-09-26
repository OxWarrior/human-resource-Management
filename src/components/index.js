import PageTools from '@/components/PageTools'

import UploadExcel from './UploadExcel'

import UploadImg from './UploadImg'

import ImageHolder from './ImageHolder'

// 将所有的组件添加进数组中
const components = [
  PageTools,
  UploadExcel,
  UploadImg,
  ImageHolder
]

export default {
  install(Vue) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
