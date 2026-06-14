import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './pages/LoginPage.vue';
import MainLayout from './layouts/MainLayout.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/admin',
    component: MainLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('./pages/admin/dashboard/index.vue')
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('./pages/admin/orders/index.vue')
      },
      {
        path: 'scheduling',
        name: 'admin-scheduling',
        component: () => import('./pages/admin/scheduling/index.vue')
      },
      {
        path: 'control-tower',
        name: 'admin-control-tower',
        component: () => import('./pages/admin/control-tower/index.vue')
      },
      {
        path: 'invoices',
        name: 'admin-invoices',
        component: () => import('./pages/admin/invoices/index.vue')
      }
    ]
  },
  {
    path: '/customer',
    component: MainLayout,
    redirect: '/customer/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'customer-dashboard',
        component: () => import('./pages/customer/dashboard/index.vue')
      },
      {
        path: 'orders',
        name: 'customer-orders',
        component: () => import('./pages/customer/orders/index.vue')
      }
    ]
  },
  {
    path: '/vendor',
    component: MainLayout,
    redirect: '/vendor/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'vendor-dashboard',
        component: () => import('./pages/vendor/dashboard/index.vue')
      },
      {
        path: 'fleet',
        name: 'vendor-fleet',
        component: () => import('./pages/vendor/fleet/index.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
