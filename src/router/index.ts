import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    redirect: (to: RouteLocationNormalized) => {
      return `${to.path}teacher`
    },
    component: () => import('@/views/layout/baseLayout.vue'),
    children: [
      {
        path: 'teacher',
        name: 'teacher',
        meta: {
          title: '教师',
        },
        component: () => import('@/views/teacher/index.vue'),
      },
    ],
  },
]

const router = createRouter ({
  history: createWebHashHistory (),
  routes,
})

export default router
