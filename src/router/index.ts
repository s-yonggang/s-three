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
      path: '/demo',
      name: 'demo',
      component: () => import('../views/demo/test2.vue'),
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
      path: '/flying-wires',
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
      path: '/accelerate-the-drive',
      name: 'demo-13',
      component: () => import('../views/demo-13/index.vue'),
    },
    {
      path: '/fresnel',
      name: 'demo-14',
      component: () => import('../views/demo-14/index.vue'),
    },
    {
      path: '/webrtc-texture',
      name: 'demo-15',
      component: () => import('../views/demo-15/index.vue'),
    },
    {
      path: '/video-texture',
      name: 'demo-15-1',
      component: () => import('../views/demo-15-1/index.vue'),
    },
    {
      path: '/video-point',
      name: 'demo-15-2',
      component: () => import('../views/demo-15-2/index.vue'),
    },
    {
      path: '/offscreen-canvas',
      name: 'demo-16',
      component: () => import('../views/demo-16/index.vue'),
    },
    {
      path: '/optimize-Object1',
      name: 'demo-17',
      component: () => import('../views/demo-17/index.vue'),
    },
    {
      path: '/optimize-Object2',
      name: 'demo-18',
      component: () => import('../views/demo-18/index.vue'),
    },
    {
      path: '/optimize-Object3',
      name: 'demo-19',
      component: () => import('../views/demo-19/index.vue'),
    },
    {
      path: '/indexed-textures1',
      name: 'demo-20',
      component: () => import('../views/demo-20/index.vue'),
    },
    {
      path: '/indexed-textures2',
      name: 'demo-21',
      component: () => import('../views/demo-21/index.vue'),
    },
    {
      path: '/flying-wires1',
      name: 'demo-22',
      component: () => import('../views/demo-22/index.vue'),
    },
    {
      path: '/flying-wires2',
      name: 'demo-23',
      component: () => import('../views/demo-23/index.vue'),
    },
    {
      path: '/bloomPass',
      name: 'demo-24',
      component: () => import('../views/demo-24/index.vue'),
    },
    {
      path: '/gpu-drive',
      name: 'demo-25',
      component: () => import('../views/demo-25/index.vue'),
    },
    {
      path: '/holographic',
      name: 'demo-26',
      component: () => import('../views/demo-26/index.vue'),
    },
    {
      path: '/yuka-bounding1',
      name: 'demo-27',
      component: () => import('../views/demo-27/index.vue'),
    },
    {
      path: '/yuka-bounding2',
      name: 'demo-28',
      component: () => import('../views/demo-28/index.vue'),
    },
    {
      path: '/point-clouds-intersection',
      name: 'demo-29',
      component: () => import('../views/demo-29/index.vue'),
    },
    {
      path: '/mesh-BVH1',
      name: 'demo-30',
      component: () => import('../views/demo-30/index.vue'),
    },
    {
      path: '/mesh-BVH2',
      name: 'demo-31',
      component: () => import('../views/demo-31/index.vue'),
    },
    {
      path: '/mesh-BVH3',
      name: 'demo-32',
      component: () => import('../views/demo-32/index.vue'),
    },
    {
      path: '/mesh-BVH4',
      name: 'demo-32-1',
      component: () => import('../views/demo-32-1/index.vue'),
    },
    {
      path: '/mesh-BVH5',
      name: 'demo-32-2',
      component: () => import('../views/demo-32-2/index.vue'),
    },
    {
      path: '/roller-coaster',
      name: 'demo-33',
      component: () => import('../views/demo-33/index.vue'),
    },
    {
      path: '/camera-path',
      name: 'demo-34',
      component: () => import('../views/demo-34/index.vue'),
    },
    {
      path: '/mesh-BVH-csg',
      name: 'demo-35',
      component: () => import('../views/demo-35/index.vue'),
    },
    {
      path: '/edit-mesh',
      name: 'demo-36',
      component: () => import('../views/demo-36/index.vue'),
    },
    {
      path: '/garmentmaking',
      name: 'demo-37',
      component: () => import('../views/demo-37/index.vue'),
    },

    {
      path: '/demo-38',
      name: 'demo-38',
      component: () => import('../views/demo-38/index.vue'),
    },

  ]
})

export default router
