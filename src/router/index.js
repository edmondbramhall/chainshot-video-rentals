import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SubmitVideo from '../views/SubmitVideo.vue'
import RentVideo from '../views/RentVideo.vue'
import Moderate from '../views/Moderate.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/rent/:hash',
      name: 'rent',
      component: RentVideo
    },
    {
      path: '/submit',
      name: 'submit',
      component: SubmitVideo
    },
    {
      path: '/moderate',
      name: 'moderate',
      component: Moderate
    }
  ]
})

export default router
