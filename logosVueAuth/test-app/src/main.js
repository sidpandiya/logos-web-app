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
import VueSanitize from "vue-sanitize";
import underscore from 'vue-underscore';

Vue.use(VueGeolocation);
Vue.use(VueRouter);
Vue.use(VueFire);
Vue.use(underscore);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCtsm796m9FbzeWWQ6EmvTD35ISOTWYoTI",
    libraries: "places" // necessary for places input
  }
});
var defaultOptions = {
  allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 's', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'u', 'span'],
  allowedAttributes: {
    'a': [ 'href', 'style' ],
    'p': [ 'href', 'style' ],
    'span': [ 'href', 'style' ],
    'ul': [ 'data-checked' ]
  },
  allowedStyles: {
    '*': {
      // Match HEX and RGB
      'color': [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      'background-color': [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      'text-align': [/^left$/, /^right$/, /^center$/],
      // Match any number with px, em, or %
      'font-size': [/^\d+(?:px|em|%)$/]
    },
    'p': {
      'font-size': [/^\d+rem$/]
    }
  }
}

Vue.use(VueSanitize, defaultOptions);

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
