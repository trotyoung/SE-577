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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/LoginPage.vue')
    },
    {
        path: '/list',
        name: 'list',
        component: () => import('../pages/ListPage.vue')
    },
    {
        path: '/details',
        name: 'details',
        component: () => import('../pages/DetailsPage.vue')
    }
  ]
})

export default router
