// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from "firebase"

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
 var config = {
 apiKey: 'AIzaSyD57NYPtxbNb6qnSOo7lg0mtD-id7Da0hw',
 authDomain: 'logos-app-915d7.firebaseapp.com',
 databaseURL: 'https://logos-app-915d7.firebaseio.com',
 projectId: 'logos-app-915d7',
 storageBucket: 'logos-app-915d7.appspot.com',
 messagingSenderId: '112244798411'
  };
  firebase.initializeApp(config);