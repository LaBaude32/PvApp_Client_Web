import { createWebHistory, createRouter } from 'vue-router'
import routesCONST, { getRouteName, getRoutePath } from '@/utilities/constantes'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notification'

const routes = [
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
    component: () => import('../views/Users.vue')
  },
  {
    path: routesCONST.settings.path,
    name: routesCONST.settings.name,
    component: () => import('../views/Settings.vue')
  },
  {
    path: routesCONST.board.path,
    name: routesCONST.board.name,
    component: () => import('../views/BoardPage.vue')
  },
  {
    path: routesCONST.affair.path + '/:id',
    name: routesCONST.affair.name,
    component: () => import('../views/Affair.vue')
  },
  {
    path: routesCONST.pv.path + '/:id',
    name: routesCONST.pv.name,
    component: () => import('../views/Pv.vue')
  },
  {
    path: routesCONST.addAffair.path,
    name: routesCONST.addAffair.name,
    component: () => import('../views/AddAffair.vue')
  },
  {
    path: getRoutePath('addPv'),
    name: getRouteName('addPv'),
    component: () => import('../views/AddPv.vue')
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
    path: getRoutePath('addHimSelfParticipant'),
    name: getRouteName('addHimSelfParticipant'),
    component: () => import('../views/AddHimSelfParticipant.vue')
  },
  {
    path: routesCONST.test.path,
    name: routesCONST.test.name,
    component: () => import('../views/Test.vue')
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

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = [
    getRoutePath('login'),
    getRoutePath('addUser'),
    getRoutePath('home'),
    getRoutePath('finishedPv'),
    getRoutePath('about')
  ]
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()
  const notifStore = useNotificationStore()

  if (authRequired && !authStore.isAuthenticated) {
    notifStore.error('Veuillez vous connecter')
    return '/login'
  }
})

export default router
