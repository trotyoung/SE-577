import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
        path: '/list',
        name: 'list',
        component: () => import('../pages/ListPage.vue')
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('../pages/Search.vue')
    },
    {
        path: '/gist',
        name: 'gist',
        component: () => import('../pages/GistPage.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../pages/AboutPage.vue')
    },
  ]
})

export default router
