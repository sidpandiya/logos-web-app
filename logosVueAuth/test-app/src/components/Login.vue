<!-- LOGIN VIEW -->

<template lang="html">
  <div id="firebaseui-auth-container"></div>
</template>

<script src="https://www.gstatic.com/firebasejs/ui/3.2.0/firebase-ui-auth__en.js"></script>

<script>
  import firebase from 'firebase';
  import firebaseui from 'firebaseui'
  import {config} from '../helpers/config';
  export default {
    name: 'login',
    mounted() {
      var uiConfig = {
        signInSuccessUrl: '/create',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID
          ]
        };
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', uiConfig);
      },
  }
</script>
