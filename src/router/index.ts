import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
    // {
    //   path: '/demo-3',
    //   name: 'home',
    //   component: () => import('../views/demo-1/index.vue'),
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
