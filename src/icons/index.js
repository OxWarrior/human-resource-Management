import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// webpack 暴露一些方法给 js 使用
// 导入当前 svg 目录下所有的 svg 文件
const req = require.context('./svg', false, /\.svg$/)
// 将 svg 文件进行转换，转换以后产生对应的 name 等属性交给 SvgIcon 组件使用
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
