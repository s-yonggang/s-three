import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/home/index.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/scan',
      name: 'scan',
      component: () => import('../views/demo-1/index.vue'),
    },
    {
      path: '/energy',
      name: 'energy',
      component: () => import('../views/demo-2/index.vue'),
    },
    {
      path: '/eclipse',
      name: 'Eclipse',
      component: () => import('../views/demo-3/index.vue'),
    },
    {
      path: '/mountains',
      name: 'Mountains',
      component: () => import('../views/demo-4/index.vue'),
    },
  ],
})

export default router
