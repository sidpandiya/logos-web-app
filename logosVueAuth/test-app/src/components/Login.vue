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
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  margin: auto;
}

.centered{
  display: none;
  font-size: 24px; 
  padding-top: 10%; 
}

.firebaseui-idp-button{
  min-width: 500px;
  max-width: 700px;
  min-height: 200px;
  border-radius: 15px;
  box-shadow: 2px 3px 1px #D3D3D3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.firebaseui-idp-text-long{
  padding: 0 auto;
  text-align: center;
}

.firebaseui-card-content{

}

.firebaseui-idp-icon{
  height: 24px;
  width: 24px;
}

.firebaseui-idp-text {
  font-size: 24px;
}

</style>