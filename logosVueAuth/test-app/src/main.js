import Vue from 'vue'
import App from './components/App.vue'
import VueRouter from 'vue-router'
import VueFire from 'vuefire'
import firebase from 'firebase'
import firebaseui from 'firebaseui';
import router from './router/router'
import {config} from './helpers/config'
import VueGeolocation from 'vue-browser-geolocation';
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGeolocation);
Vue.use(VueRouter)
Vue.use(VueFire)
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCtsm796m9FbzeWWQ6EmvTD35ISOTWYoTI",
    libraries: "places" // necessary for places input
  }
});

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
