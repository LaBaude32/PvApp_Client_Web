import { createWebHistory, createRouter } from 'vue-router'
import store from '../store/index'
import routesCONST, { getRouteName, getRoutePath } from '../utilities/constantes'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters['auth/isAuthenticated']) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters['auth/isAuthenticated']) {
    next()
    return
  }
  next('Login')
}

//TODO: verifier les droits des routes qui n'en on pas

const routes = [
  {
    path: routesCONST.home.path,
    name: routesCONST.home.name,
    component: () => import('../views/HomePage.vue')
  },
  {
    path: routesCONST.about.path,
    name: routesCONST.about.name,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue')
  },
  {
    path: routesCONST.login.path,
    name: routesCONST.login.name,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Login.vue'),
    beforeEnter: ifNotAuthenticated
  },
  {
    path: routesCONST.users.path,
    name: routesCONST.users.name,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Users.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: routesCONST.board.path,
    name: routesCONST.board.name,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/BoardPage.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: routesCONST.affair.path + '/:id',
    name: routesCONST.affair.name,
    component: () => import('../views/Affair.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: routesCONST.pv.path + '/:id',
    name: routesCONST.pv.name,
    component: () => import('../views/Pv.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: routesCONST.addAffair.path,
    name: routesCONST.addAffair.name,
    component: () => import('../views/AddAffair.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: getRoutePath('addPv'),
    name: getRouteName('addPv'),
    component: () => import('../views/AddPv.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: getRoutePath('addUser'),
    name: getRouteName('addUser'),
    component: () => import('../views/AddUser.vue')
  },
  {
    path: getRoutePath('addLot'),
    name: getRouteName('addLot'),
    component: () => import('../views/AddLot.vue')
  },
  {
    path: getRoutePath('finishedPv') + '/:id',
    name: getRouteName('finishedPv'),
    component: () => import('../views/FinishedPv.vue')
  },
  {
    path: routesCONST.test.path,
    name: routesCONST.test.name,
    component: () => import('../views/Test.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/HomePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
