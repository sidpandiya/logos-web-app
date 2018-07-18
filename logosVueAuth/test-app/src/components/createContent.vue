<!-- LOGOS APP VIEW -->

<template>
  <div class="container">
    <div class="page-header">
      <h1>Post Creation Page</h1>
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
            <label for="articleLocation">
              <gmap-autocomplete
                @place_changed="setPlace">
              </gmap-autocomplete> <span id="locationAutofill">Enter a location.</span>
            </label>
            <br/>
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
            <!-- Quill Editor Integration -->
            <vue-editor id="articleBody" v-model="newArticle.body"></vue-editor>
            <!-- <input type="text" id="articleBody" class="form-control" v-model="newArticle.body"> -->
          </div>
          <input id="submit" type="submit" class="btn btn-primary" value="Post">
          </form>
          <!-- Vue Upload Component -->
          <!-- <file-upload
            ref="upload"
            v-model="files"
            post-action="/post.method"
            put-action="/put.method"
            @input-file="inputFile"
            @input-filter="inputFilter"
          >
          Upload file
          </file-upload> -->
          <div class="example-simple">
    <h1 id="example-title" class="example-title">Media Upload Test</h1>
    <div class="upload">
      <ul>
        <li v-for="(file, index) in files" :key="file.id">
          <span>{{file.name}}</span> -
          <span>{{file.size | formatSize}}</span> -
          <span v-if="file.error">{{file.error}}</span>
          <span v-else-if="file.success">success</span>
          <span v-else-if="file.active">active</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
        </li>
      </ul>
      <!-- Media Upload Example -->
      <div class="example-btn">
        <file-upload
          class="btn btn-primary"
          post-action="/upload/post"
          extensions="gif,jpg,jpeg,png,webp"
          accept="image/png,image/gif,image/jpeg,image/webp"
          :multiple="true"
          :size="1024 * 1024 * 10"
          v-model="files"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload">
          <i class="fa fa-plus"></i>
          Select files
        </file-upload>
        <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          Start Upload
        </button>
        <button type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
          <i class="fa fa-stop" aria-hidden="true"></i>
          Stop Upload
        </button>
      </div>
    </div>
  </div>
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
              <th>Author:</th>
              <th>Body:</th>
              <th>Location:</th>
              <th>Date Added:</th>
              <th>View Count:</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="story in stories">
              <td>{{ story.title }}</td>
              <td>{{ story.author }}</td>
              <td v-html="story.body">{{  }}</td>
              <td>{{ story.location }}</td>
              <td>{{ story.dateAdded }}</td>
              <td>{{ story.viewCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <router-view/>
  </div>

</template>

<script src="https://maps.google.com/maps?file=api&amp;v=3&amp;sensor=false" type="text/javascript"></script>

<script>

import { VueEditor } from 'vue2-editor'

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
var underscore = require('underscore');

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
let userTweetsRef = db.ref('userTweets');

var currentUser = "";
var currentUserID = "";
firebase.auth().onAuthStateChanged((function(user) {
  if (user) {
    //social media user id
    //console.log(user.providerData[0].uid);

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
  components: {
      VueEditor
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
      var location = document.getElementById("locationAutofill").innerHTML;
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const now = new Date().toLocaleDateString('en-US', options);
      this.newArticle.dateAdded = now.toString();
      this.newArticle.author = currentUser;
      this.newArticle.authorID = currentUserID;

      //sanitize inputs
      console.log("Old location: " + location);
      var encodedLocation = this.$sanitize(location);
      var decodedLocation = encodedLocation.replace(/&amp;/g, '&');
      if(decodedLocation == "Enter a location." || decodedLocation.trim() == ""){
        decodedLocation = "Location unknown";
      }
      this.newArticle.location = decodedLocation;
      console.log("New location: " + this.newArticle.location);

      console.log("Old: " + this.newArticle.title);
      var encodedTitle = this.$sanitize(this.newArticle.title);
      var decodedTitle = encodedTitle.replace(/&amp;/g, '&');
      this.newArticle.title = decodedTitle;
      console.log("New: " + this.newArticle.title);

      console.log("Old body: " + this.newArticle.body);
      var backToTags = underscore.unescape(this.newArticle.body);
      this.newArticle.body = this.$sanitize(backToTags);
      console.log("New body: " + this.newArticle.body);

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
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.center = marker;
        this.currentPlace = null;
      }
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(this.center.lat, this.center.lng);

      geocoder.geocode({'latLng': latlng}, function(results, status) {
        var location = "";
        // This is checking to see if the Geocode Status is OK before proceeding    
        if (status == google.maps.GeocoderStatus.OK) {

          //This is placing the marker at the returned address    
          if (results[1]) {
              location = (results[1].formatted_address);
          }
        }
        document.getElementById("locationAutofill").innerHTML = location;
        console.log(document.getElementById("locationAutofill").innerHTML);
      })
    },
    addMarker() {
      
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
     /**
     * Has changed
     * @param  Object|undefined   newFile   Read only
     * @param  Object|undefined   oldFile   Read only
     * @return undefined
     */
    inputFile: function (newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log('response', newFile.response)
        if (newFile.xhr) {
          //  Get the response status code
          console.log('status', newFile.xhr.status)
        }
      }
    },
    /**
     * Pretreatment
     * @param  Object|undefined   newFile   Read and write
     * @param  Object|undefined   oldFile   Read only
     * @param  Function           prevent   Prevent changing
     * @return undefined
     */
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent()
        }
      }

      // Create a blob field
      newFile.blob = ''
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    }
  }
}
</script>

<!-- CSS STYLING -->

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }

  #articleBody {
    height: 200px;
  }

  form {
    padding-left: 5%;
    padding-right: 5%;
  }

  #submit {
    margin-bottom: 2%;
  }

  #findLocation {
    padding-bottom: 2%;
  }

  /* upload component styling */
  .example-simple label.btn {
    margin-bottom: 0;
    margin-right: 1rem;
  }

</style>
