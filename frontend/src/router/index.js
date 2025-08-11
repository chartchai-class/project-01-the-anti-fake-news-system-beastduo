import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
const NewsDetail = () => import('../pages/NewsDetail.vue')
const AboutView = () => import('../pages/AboutView.vue')
const ContactView = () => import('../pages/ContactView.vue')

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/news/:id', name: 'news-detail', component: NewsDetail },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/contact', name: 'contact', component: ContactView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router


