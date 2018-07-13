import Vue from 'vue'
import App from './components/App.vue'
import VueRouter from 'vue-router'
import VueFire from 'vuefire'
import firebase from 'firebase'
import firebaseui from 'firebaseui';
import router from './router/router'
import {config} from './helpers/config'
import VueGeolocation from 'vue-browser-geolocation';
Vue.use(VueGeolocation);
Vue.use(VueRouter)
Vue.use(VueFire)

new Vue({
  router,
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$router.push('/create')
      } else {
        this.$router.push('/login')
      }
     });
    },
  el: '#app',
  render: h => h(App)
});
