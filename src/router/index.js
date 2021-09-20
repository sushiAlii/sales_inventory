import Vue from "vue";
import VueRouter from "vue-router";
import { supabase } from "@/supabase";
import store from "../store/index.js";

import Dashboard from "../views/pages/Dashboard.vue";
import Items from "../views/pages/Items.vue";
import Inventory from "../views/pages/Inventory.vue";
import Operations from "../views/pages/Operations.vue";
import Accounts from "../views/pages/Accounts.vue";
import ManageAccounts from "../views/pages/Manage_Accounts.vue";
import Miscellaneous from "../views/pages/Miscellaneous.vue";
import Login from "../views/auth/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/Auth.vue"),
    meta: { guest: true },
    children: [
      {
        path: "/login",
        name: "Login",
        component: Login,
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/views/Index.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "/items",
        name: "Items",
        component: Items,
      },
      {
        path: "/inventory",
        name: "Inventory",
        component: Inventory,
      },
      {
        path: "/operations",
        name: "Operations",
        component: Operations,
      },
      {
        path: "/settings/accounts",
        name: "Account",
        component: Accounts,
      },
      {
        path: "/settings/manage_accounts",
        name: "Manage Accounts",
        component: ManageAccounts,
      },
      {
        path: "/settings/miscellaneous",
        name: "Miscellaneous",
        component: Miscellaneous,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

function loggedIn() {
  if (localStorage.getItem("supabase.auth.token") != null) {
    return true;
  } else {
    return false;
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!loggedIn()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (loggedIn()) {
      next({
        path: "/",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
