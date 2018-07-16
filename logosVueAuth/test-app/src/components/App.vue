<!-- APP / HOME VIEW -->

<template> 
  <div id="app"> 
    <div class="centered"><router-link to="/login">Go to the login page!</router-link></div>
    <!-- <div class="centered"><router-link to="/app">Go to the Logos page!</router-link></div> -->
    <router-view></router-view>
    <router-view name="editor"></router-view>
  </div>
</template> 

<script>
  export default { 
    name: 'app', 
  }
</script>

<style>
  .centered {
    text-align: center;
  }
</style>
