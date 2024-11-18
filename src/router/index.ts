import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import GenKey from '@/views/genKey.vue'
import OnboardingTab from '@/views/OnboardingTab.vue'
import Dichiarazione from '@/views/Dichiarazione.vue'
import DichiarazioneVerificatore from '../views/DichiarazioneVerificatore.vue'
import DichiarazioneProduttore from '@/views/DichiarazioneProduttore.vue'
import Login from '@/views/Login.vue'
import Storico from '@/views/Storico.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/genKey',
      name: 'genKey',
      component: GenKey,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/onboardingTab',
      name: 'onboardingTab',
      component: OnboardingTab,
    },
    {
      path: '/dichiarazione',
      name: 'dichiarazione',
      component: Dichiarazione,
    },
    {
      path: '/dichiarazioneVerificatore',
      name: 'dichiarazioneVerificatore',
      component: DichiarazioneVerificatore,
    },
    {
      path: '/dichiarazioneProduttore',
      name: 'dichiarazioneProduttore',
      component: DichiarazioneProduttore,
    },
    {
      path: '/storico',
      name: 'storico',
      component: Storico,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
})

export default router
