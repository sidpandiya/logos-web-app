<template>
  <div class="login">
    <h3>Sign In</h3>
    <button id="facebookButton" v-on:click="authenticateFB">Facebook</button>
    <button id="googleButton" v-on:click="authenticateGL">Google</button>
    <button id="twitterButton" v-on:click="authenticateTW">Twitter</button>
  </div>
</template>

<script>
export default {
  name: 'auth',
  data:{
    id: ''
  },
  methods: {
    authenticateFB: function() {
      console.log("fb")
    },
    authenticateGL: function() {
      console.log("gl")
    },
    authenticateTW: function() {
      console.log("tw")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

button{
  display: block;
  margin: auto;
  width: 20%;
  height: 50px;
}

#facebookButton{
  background-color: #3B5998;
  border-radius: 3px;
  color: white;
}

#googleButton{
  background-color: #DB4437;
  border-radius: 3px;
  color: white;
}

#twitterButton{
  background-color: #1DA1F2;
  border-radius: 3px;
  color: white;
}
</style>
