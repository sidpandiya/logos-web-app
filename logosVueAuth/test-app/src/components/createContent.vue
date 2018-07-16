<!-- LOGOS APP VIEW -->

<template>
  <div class="container">
    <div class="page-header">
      <h1>LOLOLOLOLOLOLOL</h1>
      <button @click='logOut'>Log out</button>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h3>Add an Article</h3>
      </div>
      <div class="panel-body">
        <form id="addArticle" class="row" v-on:submit.prevent="postArticle">
          <div class="form-group">
            <label for="articleTitle">Title:</label>
            <input type="text" id="articleTitle" class="form-control" v-model="newArticle.title">
          </div>
          <div id="findLocation">
            <span id="locationFound">Finding Location</span>
          </div>
          <gmap-map
            :center="center"
            :zoom="12"
            style="width:100%;  height: 400px;"
          >
            <gmap-marker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              @click="center=m.position"
            ></gmap-marker>
          </gmap-map>
          <div class="form-group">
            <label for="articleBody">Body:</label>
            <input type="text" id="articleBody" class="form-control" v-model="newArticle.body">
          </div>
          <input id="submit" type="submit" class="btn btn-primary" value="Post">
          </form>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h3>Articles</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>
                Title:
              </th>
              <th>
                Author:
              </th>
              <th>
                Body:
              </th>
              <th>
                Location:
              </th>
              <th>
                Date Added:
              </th>
              <th>
                View Count:
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="storie in stories">
              <td>
                {{ storie.title }}
              </td>
              <td>
                {{ storie.author }}
              </td>
              <td>
                {{ storie.body }}
              </td>
              <td>
                {{ storie.location }}
              </td>
              <td>
                {{ storie.dateAdded }}
              </td>
              <td>
                {{ storie.viewCount }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script src="https://maps.google.com/maps?file=api&amp;v=3&amp;sensor=false"
     type="text/javascript"></script>
<script>

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

var config = {
    apiKey: "AIzaSyCA5R7pUDrcpBbhxQ1dk4jLeeZiwl7sV3c",
    authDomain: "web-app-testing-3309d.firebaseapp.com",
    databaseURL: "https://web-app-testing-3309d.firebaseio.com",
    projectId: "web-app-testing-3309d",
    storageBucket: "web-app-testing-3309d.appspot.com",
    messagingSenderId: "832434382294"
  };

let app = firebase.initializeApp(config);

let db = app.database();

let usersRef = db.ref('users');
let storiesRef = db.ref('stories');

var currentUser = "";
var currentUserID = "";
firebase.auth().onAuthStateChanged((function(user) {
  if (user) {
    console.log(user.uid);
    currentUser = user.displayName;
    currentUserID = user.uid;
  } else {
    // No user is signed in.
  }
}));

export default {
  name: 'create',
  firebase: {
    users: usersRef,
    stories: storiesRef
  },
  data (){
    return { 
          newArticle: {
            title: '',
            body: '',
            author: '',
            authorID: '',
            location: '',
            viewCount: 0,
            dateAdded: ''
          },
          stories: storiesRef,
          center: { lat: 34.0689, lng: -118.4452 },
          markers: [],
          places: [],
          currentPlace: null
    }
  },
  mounted() {
    this.geolocate();
  },
  methods: {
    postArticle: function(){
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const now = new Date().toLocaleDateString('en-US', options);
      this.newArticle.dateAdded = now.toString();
      this.newArticle.author = currentUser;
      this.newArticle.authorID = currentUserID;
      this.newArticle.location = document.getElementById("locationFound").innerHTML;
      storiesRef.push(this.newArticle);
      this.newArticle.title = '';
      this.newArticle.body = '';
      this.newArticle.location = '';
      this.newArticle.dateAdded = '';
      this.newArticle.author = "";
      this.newArticle.authorID = "";
    },
    logOut() { 
        firebase.auth().signOut();
    },
    setPlace(place) {
      this.currentPlace = place;
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(this.center.lat, this.center.lng);

        geocoder.geocode({'latLng': latlng}, function(results, status) {
        var location = "";
          // This is checking to see if the Geoeode Status is OK before proceeding    
          if (status == google.maps.GeocoderStatus.OK) {

            //This is placing the marker at the returned address    
            if (results[1]) {
                location = (results[1].formatted_address);
            }
          }
          document.getElementById("locationFound").innerHTML = location;
        })
      });

    }
  } 
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

#articleBody{
  height: 200px;
}

form{
  padding-left: 5%;
  padding-right: 5%;
}

#submit{ 
  margin-bottom: 2%;
}

#findLocation{
  padding-bottom: 2%;
}
</style>
