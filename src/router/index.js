import { createRouter, createWebHashHistory } from 'vue-router'
import indexPage from '../views/indexPage.vue'
import login from '../components/login.vue'
import admin from '../components/admin.vue'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: indexPage,
      children: [
        { path: '', component: login },
        { path: 'admin', component: admin }
      ],
    }
  ]
})

export default router