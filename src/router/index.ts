import { createRouter, createWebHistory } from 'vue-router'
import RegisterDomjudge from '@/views/RegisterDomjudge.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'RegisterDomjudge',
      component: RegisterDomjudge
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('@/views/HelpDocumentation.vue')
    }
  ]
})

export default router
