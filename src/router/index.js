import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/pages/Dashboard.vue'
import Purchases from '../views/pages/Purchases.vue'
import Inventory from '../views/pages/Inventory.vue'
import Settings from '../views/pages/Settings.vue'
import Login from '../views/auth/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/purchases',
    name: 'Purchases',
    component: Purchases
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
