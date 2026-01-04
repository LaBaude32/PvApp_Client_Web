import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notification'
import routesCONST, { getRouteName, getRoutePath } from '@/utilities/constantes'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: routesCONST.home.path,
    name: routesCONST.home.name,
    component: () => import('../views/HomePage.vue')
  },
  {
    path: routesCONST.about.path,
    name: routesCONST.about.name,
    component: () => import('../views/About.vue')
  },
  {
    path: routesCONST.login.path,
    name: routesCONST.login.name,
    component: () => import('../views/Login.vue')
  },
  {
    path: routesCONST.users.path,
    name: routesCONST.users.name,
    component: () => import('../views/Users.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: routesCONST.settings.path,
    name: routesCONST.settings.name,
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: routesCONST.board.path,
    name: routesCONST.board.name,
    component: () => import('../views/BoardPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: routesCONST.affair.path + '/:id',
    name: routesCONST.affair.name,
    component: () => import('../views/Affair.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: routesCONST.pv.path + '/:id',
    name: routesCONST.pv.name,
    component: () => import('../views/Pv.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: routesCONST.addAffair.path,
    name: routesCONST.addAffair.name,
    component: () => import('../views/AddAffair.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: getRoutePath('addPv'),
    name: getRouteName('addPv'),
    component: () => import('../views/AddPv.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: getRoutePath('addUser'),
    name: getRouteName('addUser'),
    component: () => import('../views/AddUser.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: getRoutePath('addLot'),
    name: getRouteName('addLot'),
    component: () => import('../views/AddLot.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: getRoutePath('addHimSelfParticipant') + '/:pvId',
    name: getRouteName('addHimSelfParticipant'),
    component: () => import('../views/AddHimSelfParticipant.vue'),
    props: true
  },
  {
    path: getRoutePath('finishedPv') + '/:id',
    name: getRouteName('finishedPv'),
    component: () => import('../views/FinishedPv.vue')
  },
  {
    path: routesCONST.test.path,
    name: routesCONST.test.name,
    component: () => import('../views/Test.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/test-annotation',
    name: 'TestAnnotation',
    component: () => import('../views/TestAnnotation.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: routesCONST.myAccount.path,
    name: routesCONST.myAccount.name,
    component: () => import('../views/Account.vue'),
    meta: { requiresAuth: true }
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

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  // const publicPages = [
  //   getRoutePath('login'),
  //   getRoutePath('addUser'),
  //   getRoutePath('home'),
  //   getRoutePath('finishedPv'),
  //   getRoutePath('about'),
  //   getRoutePath('addHimSelfParticipant')
  // ]
  // const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()
  const notifStore = useNotificationStore()

  // if (authRequired && !authStore.isAuthenticated) {
  //   notifStore.error('Veuillez vous connecter')
  //   return '/login'
  // }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // La route nécessite une authentification
    if (!authStore.isAuthenticated) {
      // L'utilisateur n'est pas authentifié, rediriger vers la page de connexion
      notifStore.error('Veuillez vous connecter')
      return '/login'
    }
  }
})

export default router
