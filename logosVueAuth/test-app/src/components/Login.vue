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
          firebase.auth.FacebookAuthProvider.PROVIDER_ID
          ]
        };
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', uiConfig);
      },
  }
</script>

<style>

#firebaseui-auth-container{
  min-width: 500px;
  max-width: 700px;
  min-height: 200px;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  margin: auto;
}

.centered{
  display: none;
  font-family: "Roboto","Helvetica","Arial",sans-serif;
  font-size: 24px; 
  padding-top: 10%; 
}

.firebaseui-idp-button{
  min-width: 500px;
  max-width: 700px;
  min-height: 200px;
  border-radius: 15px;
  box-shadow: 0 0 0 0.5px #D3D3D3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.firebaseui-idp-text-long{
  padding: 0 auto;
  text-align: center;
}

.firebaseui-card-content, firebaseui-container, .firebaseui-page-provider-sign-in, .firebaseui-id-page-provider-sign-in, form{
  min-width: 500px;
  max-width: 700px;
  min-height: 200px;
}

.firebaseui-idp-icon{
  height: 24px;
  width: 24px;
}

.firebaseui-idp-text {
  font-size: 24px;
}

</style>