import Vue from 'vue'
import VueRouter from 'vue-router'
import { supabase } from '@/supabase'

import Dashboard from '../views/pages/Dashboard.vue'
import Items from '../views/pages/Items.vue'
import Inventory from '../views/pages/Inventory.vue'
import Operations from '../views/pages/Operations.vue'
import Accounts from '../views/pages/Accounts.vue'
import ManageAccounts from '../views/pages/Manage_Accounts.vue'
import Miscellaneous from '../views/pages/Miscellaneous.vue'
import Login from '../views/auth/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    meta: { requiresAuth: true },
    component: Dashboard
  },
  {
    path: '/items',
    name: 'Items',
    meta: { requiresAuth: true },
    component: Items
  },
  {
    path: '/inventory',
    name: 'Inventory',
    meta: { requiresAuth: true },
    component: Inventory
  },
  {
    path: '/operations',
    name: 'Operations',
    meta: { requiresAuth: true },
    component: Operations
  },
  {
    path: '/login',
    name: 'Login',
    meta: { guest: true },
    component: Login,
  },
  {
    path: '/settings/accounts',
    name: 'Account',
    meta: { requiresAuth: true },
    component: Accounts
  },
  {
    path: '/settings/manage_accounts',
    name: 'Manage Accounts',
    meta: { requiresAuth: true },
    component: ManageAccounts
  },
  {
    path: '/settings/miscellaneous',
    name: 'Miscellaneous',
    meta: { requiresAuth: true },
    component: Miscellaneous
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function loggedIn(){
  const user = supabase.auth.user()
  if(user){
    return true;
  }else{
    return false;
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
      if (loggedIn()) {
          next({
            path: '/',
            query: { redirect: to.fullPath }
          })
      } else {
          next()
        }
  }else{
      next() // make sure to always call next()!
  }
})

export default router
