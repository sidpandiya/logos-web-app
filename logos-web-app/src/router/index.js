import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@/components/Auth'

Vue.use(Router)

var auth = new Vue({
	el: '#app',
	data: {}
})

export default new Router({
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      component: Auth
    }
  ]
})
