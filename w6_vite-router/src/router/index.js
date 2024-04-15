import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/UserLayoutView.vue'),
      children: [
        {
          path: '/',
          component: HomeView
        },
        {
          path: 'products',
          component: () => import('../views/ProductsView.vue')
        },
        {
          path: 'product/:id',
          component: () => import('../views/ProductInfoView.vue')
        },
        {
          path: 'cart',
          component: () => import('../views/CartView.vue')
        },
        {
          path: 'about',
          component: () => import('../views/AboutView.vue')
        },
      ],
    },
    
    {
      path: '/login',
      component: () => import('../views/LoginView.vue')
    },

    {
      path: '/admin',
      component: () => import('../views/admin/DashboardView.vue'),
      children: [
        {
          path: 'products',
          component: () => import('../views/admin/AdminProductsView.vue')
        },
        {
          path: 'order',
          component: () => import('../views/admin/OrderView.vue')
        },
        {
          path: 'coupons',
          component: () => import('../views/admin/CouponsView.vue')
        },
        {
          path: 'articles',
          component: () => import('../views/admin/AdminArticlesView.vue')
        },
      ]
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

export default router
