import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import NewsDetailsPage from '../pages/NewsDetailsPage.vue'
import VotePage from '../pages/VotePage.vue'
import newsSeed from '../mock/news.json'

// Precompute valid news IDs from seed data to guard dynamic routes
const validNewsIds = new Set(newsSeed.map(n => n.id))

const guardValidNewsId = (to) => {
  const id = to.params.id
  if (!id || !validNewsIds.has(String(id))) {
    return { path: '/' }
  }
  return true
}

const routes = [
  { path: '/', name: 'home', component: HomePage },
  {
    path: '/news/:id',
    name: 'news-details',
    component: NewsDetailsPage,
    beforeEnter: guardValidNewsId,
  },
  {
    path: '/news/:id/vote',
    name: 'news-vote',
    component: VotePage,
    beforeEnter: guardValidNewsId,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router


