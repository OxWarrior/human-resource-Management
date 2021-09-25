import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: 'detail',
      component: () => import('@/views/employees/detail'),
      meta: { title: '员工', icon: 'people' },
      hidden: true
    }
  ]
}
