import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index";
import routesCONST, { getRouteName, getRoutePath } from "../utilities/constantes";

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters["auth/isAuthenticated"]) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters["auth/isAuthenticated"]) {
    next();
    return;
  }
  next("Login");
};

Vue.use(VueRouter);

//TODO: verifier les droits des routes qui n'en on pas

const routes = [
  {
    path: routesCONST.home.path,
    name: routesCONST.home.name,
    component: Home
  },
  {
    path: routesCONST.about.path,
    name: routesCONST.about.name,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/About.vue")
  },
  {
    path: routesCONST.login.path,
    name: routesCONST.login.name,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Login.vue"),
    beforeEnter: ifNotAuthenticated
  },
  {
    path: routesCONST.user.path,
    name: routesCONST.user.name,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Users.vue"),
    beforeEnter: ifAuthenticated
  },
  {
    path: routesCONST.board.path,
    name: routesCONST.board.name,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/BoardPage.vue"),
    beforeEnter: ifAuthenticated
  },
  {
    path: routesCONST.affair.path + "/:id",
    name: routesCONST.affair.name,
    component: () => import("../views/Affair.vue"),
    beforeEnter: ifAuthenticated
  },
  {
    path: routesCONST.pv.path + "/:id",
    name: routesCONST.pv.name,
    component: () => import("../views/Pv_v2.vue"),
    beforeEnter: ifAuthenticated
  },
  {
    path: routesCONST.addAffair.path,
    name: routesCONST.addAffair.name,
    component: () => import("../views/AddAffair.vue"),
    beforeEnter: ifAuthenticated
  },
  {
    path: getRoutePath("addPv"),
    name: getRouteName("addPv"),
    component: () => import("../views/AddPv.vue"),
    beforeEnter: ifAuthenticated
  },
  {
    path: getRoutePath("addUser"),
    name: getRouteName("addUser"),
    component: () => import("../views/AddUser.vue")
  },
  {
    path: getRoutePath("addLot"),
    name: getRouteName("addLot"),
    component: () => import("../views/AddLot.vue")
  },
  {
    path: getRoutePath("finishedPv") + "/:id",
    name: getRouteName("finishedPv"),
    component: () => import("../views/FinishedPv.vue")
  },
  {
    path: routesCONST.test.path,
    name: routesCONST.test.name,
    component: () => import("../views/Test.vue")
  },
  {
    path: "*",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Home.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
