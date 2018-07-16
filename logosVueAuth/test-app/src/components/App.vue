<!-- APP / HOME VIEW -->

<template> 
  <div id=”app”> 
    <router-link to="/login">Go to the login page!</router-link>
    <router-link to="/app">Go to the Logos page!</router-link>
    <router-view></router-view>
  </div>
</template> 

<script>
  export default { 
    name: 'app', 
  }
</script>

<style>
  /* No styling yet */
</style>
