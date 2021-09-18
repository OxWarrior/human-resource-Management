import defaultSettings from '@/settings'

// 页面标题
const title = defaultSettings.title || 'Vue Admin Template'

// 获取页面标题方法
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
