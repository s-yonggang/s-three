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
    {
      path: '/demo-5',
      name: 'demo-5',
      component: () => import('../views/demo-5/index.vue'),
    },
    {
      path: '/modelControl',
      name: 'modelControl',
      component: () => import('../views/demo-6/index.vue'),
    },
    {
      path: '/particle',
      name: 'particle',
      component: () => import('../views/demo-7/index.vue'),
    },
    {
      path: '/modelviewer',
      name: 'demo-8',
      component: () => import('../views/demo-8/index.vue'),
    },
    {
      path: '/gpuPoint',
      name: 'demo-9',
      component: () => import('../views/demo-9/index.vue'),
    },
    {
      path: '/customizeShader1',
      name: 'demo-10',
      component: () => import('../views/demo-10/index.vue'),
    },
    {
      path: '/shader-base-1',
      name: 'demo-11',
      component: () => import('../views/demo-11/index.vue'),
    },
    {
      path: '/shader-base-2',
      name: 'demo-12',
      component: () => import('../views/demo-12/index.vue'),
    },
    {
      path: '/demo-13',
      name: 'demo-13',
      component: () => import('../views/demo-13/index.vue'),
    },
  ],
})

export default router
