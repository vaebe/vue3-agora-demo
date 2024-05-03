import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    redirect: (to: RouteLocationNormalized) => {
      return `${to.path}config`
    },
    component: () => import('@/views/layout/baseLayout.vue'),
    children: [
      {
        path: 'config',
        name: 'config',
        meta: {
          title: '项目设置',
        },
        component: () => import('@/views/projectConfig.vue'),
      },
      {
        path: 'basicVideoCall',
        name: 'basicVideoCall',
        meta: {
          title: '基础视频通话',
        },
        component: () => import('@/views/basicVideoCall/index.vue'),
      },
      {
        path: 'oneToManyLiveStreaming',
        name: 'oneToManyLiveStreaming',
        meta: {
          title: '一对多直播',
        },
        component: () => import('@/components/ViewComponent.vue'),
        children: [
          {
            path: 'host',
            name: 'oneToManyLiveStreaming.host',
            meta: {
              title: '主播',
            },
            component: () => import('@/views/oneToManyLiveStreaming/host.vue'),
          },
          {
            path: 'spectator',
            name: 'oneToManyLiveStreaming.spectator',
            meta: {
              title: '观众',
            },
            component: () => import('@/views/oneToManyLiveStreaming/spectator.vue'),
          }
        ]
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
