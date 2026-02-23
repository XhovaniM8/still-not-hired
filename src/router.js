import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Applications from './views/Applications.vue'
import Resumes from './views/Resumes.vue'
import Contacts from './views/Contacts.vue'
import Analytics from './views/Analytics.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/applications', name: 'Applications', component: Applications },
  { path: '/resumes', name: 'Resumes', component: Resumes },
  { path: '/contacts', name: 'Contacts', component: Contacts },
  { path: '/analytics', name: 'Analytics', component: Analytics }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
