import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import App from '../components/App.vue'
import createContent from '../components/createContent.vue';
import Quill from '../components/Quill.vue';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    { path: '/create', component: createContent }
    // { path: '/create', components: {
    //   default: createContent,
    //   editor: Quill}
    // }
  ]
});
export default router;