import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
const NewsDetail = () => import('../pages/NewsDetail.vue')

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/news/:id', name: 'news-detail', component: NewsDetail },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router


