import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import ReviewDetail from '../pages/ReviewDetail.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/game-reviews', redirect: '/' },        
  { path: '/platform/:platform', name: 'platform', component: Home, props: true },
  { path: '/review/:id', name: 'review', component: ReviewDetail, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' },     
]

export default createRouter({
  history: createWebHistory(),                         
  routes,
  scrollBehavior: () => ({ top: 0 }),
})


