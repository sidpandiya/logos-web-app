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
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <div class="panel-body">
        <form id="addArticle" class="row" v-on:submit.prevent="postArticle">
          <div class="form-group">
            <label for="articleTitle">Title:</label>
            <input type="text" pattern=".{1,}" required id="articleTitle" class="form-control" v-model="newArticle.title">
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
              <vue-editor id="articleBody" v-model="newArticle.media"></vue-editor>
              <!-- <input type="text" pattern=".{30,}" required id="articleBody" class="form-control" v-model="newArticle.media"> -->
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
                  post-action="http://localhost:3000/create"
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
              <th>Author ID:</th>
              <th>Body:</th>
              <th>Location:</th>
              <th>Date Added:</th>
              <th>Views:</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts">
              <td>{{ post.title }}</td>
              <td>{{ post.userId }}</td>
              <td v-html="post.media">{{  }}</td>
              <td>{{ post.city + ", " + post.country }}</td>
              <td>{{ post.createdOn }}</td>
              <td>{{ post.views }}</td>
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
import FileUpload from 'vue-upload-component'

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

let usersRef = db.ref('user');
let postsRef = db.ref('posts');
let userTweetsRef = db.ref('userTweets');

var currentUser = "";
var currentUserID = "";


// postsRef.once('value', function(snapshot){
//     snapshot.forEach(function(_child){
//         var society = _child.key;
//         console.log(society);
//     });
// });

export default {
  name: 'create',
  firebase: {
    users: usersRef,
    posts: postsRef
  },
  components: {
    FileUpload,
    VueEditor
  },
  data (){
    return { 
          newArticle: {
            title: '',
            media: '',
            userId: "",
            city: "N/A",
            country: "N/A",
            views: 0,
            createdOn: "",
            deletedByAdmin: 0,
            isDeleted: 0,
            isEdited: 0,
            isReported: 0,
            latitude: "0",
            longitude: "0",
            modifiedOn: "",
            type: 1
          },
          newUser: {
            city: "",
            contact: "",
            country: "N/A",
            currentCity: "N/A",
            currentCountry: "N/A",
            email: "fakeemail@gmail.com",
            highEndorsmentCount: 50,
            highEndorsmentName: "Indian Politics",
            isDeleted: 0,
            isNormalUser: 1,
            latitude: "0",
            logginType: 1,
            longitude: "0",
            name: "Tester",
            photo: "https://i.etsystatic.com/8916355/r/il/25c83f/55...",
            politicalOrientation: "Center(moderate)",
            socialId: "fakeSocialID"
          },
          posts: postsRef,
          center: { lat: 0, lng: 0 },
          markers: [],
          places: [],
          currentPlace: null,
          files: [],
          errors: []
    }
  },
  mounted() {
    this.geolocateInitial(this.checkUser);
    //this.checkUser();
  },
  methods: {
    addUser: function(userObject, userId){
      this.newUser.latitude = this.center.lat;
      this.newUser.longitude = this.center.lng;
      var uData = userObject.providerData[0];
      this.newUser.email = uData.email;
      this.newUser.name = uData.displayName;
      this.newUser.contact = uData.phoneNumber;
      this.newUser.photo = uData.photoURL;
      this.newUser.socialId = userId;
      usersRef.push(this.newUser);


    },
    checkUser: function(){
      var inDB = false;

      var $this = this;
      var userObject = {};

      firebase.auth().onAuthStateChanged((function(user) {
        if (user) {
          userObject = user;

          //social media user id
          //console.log(user.providerData[0]);

          currentUser = user.displayName;
          currentUserID = user.uid;

          usersRef.orderByChild("socialId").equalTo(currentUserID).on('value', function(snapshot) {
            if (!snapshot.exists()) {
              inDB = false;
            }
          });
          if(!inDB){
            $this.addUser(userObject, currentUserID);
          }

          //usersRef.on('value', function(snapshot) {
          //   var user = snapshot.val();
          //   if (user.socialId == currentUserID){
          //      alert ("exist");
          //   } else {
          //    console.log(user.socialId);
          //   }
          //});

        } else {
          // No user is signed in.
        }
      }));
    },
    checkForm: function(e) {
      this.errors = [];
      if(this.newArticle.media.length < 75) {
        if(this.newArticle.title.length < 1){
          this.errors.push("Please fill in a valid title.");
        }
        this.errors.push("Please fill in the body with more characters.");
        return false;
      }
      if(this.newArticle.title.length < 1){
        this.errors.push("Please fill in a valid title.");
        return false;
      }
      return true;
    },
    postArticle: function(){
      var location = this.newArticle.city + ", " + this.newArticle.country;
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const now = new Date().toLocaleDateString('en-US', options);
      this.newArticle.createdOn = now.toString();
      this.newArticle.author = currentUser;

      //sanitize inputs
      console.log("Old location: " + location);
      var encodedLocation = this.$sanitize(location);
      var decodedLocation = encodedLocation.replace(/&amp;/g, '&');
      if(decodedLocation == "Enter a location." || decodedLocation.trim() == ""){
        decodedLocation = "Location unknown";
      }
      this.newArticle.location = decodedLocation;
      console.log("New location: " + this.newArticle.location);

      console.log("Old title: " + this.newArticle.title);
      var encodedTitle = this.$sanitize(this.newArticle.title);
      var decodedTitle = encodedTitle.replace(/&amp;/g, '&');
      this.newArticle.title = decodedTitle;
      console.log("New title: " + this.newArticle.title);

      console.log("Old body: " + this.newArticle.media);
      var backToTags = underscore.unescape(this.newArticle.media);
      this.newArticle.media = this.$sanitize(backToTags);
      console.log("New body: " + this.newArticle.media);

      console.log(this.newArticle.title.length);
      console.log(this.newArticle.media.length);

      console.log(currentUserID);
      this.newArticle.userId = "" + currentUserID + "";
      if(this.checkForm(event) == true){
        postsRef.push(this.newArticle);
        this.newArticle.title = '';
        this.newArticle.media = '';
        this.newArticle.city = "N/A";
        this.newArticle.country = "N/A";
        this.newArticle.createdOn = '';
        this.newArticle.author = "";
        this.newArticle.authorID = "";
      }
    },
    logOut() { 
        firebase.auth().signOut();
    },
    setPlace(place) {
      this.currentPlace = place;
      console.log(place.address_components);

      console.log(typeof(place.address_components));
      console.log(place.address_components[1].short_name);
      console.log(place.address_components[3].short_name);
      for(var property in place.address_components){
        for(var i=0; i<10; i++){
          if(property == i){
            var locationInstance = place.address_components[property];
            if(locationInstance.types[0] == "city" || locationInstance.types[0] == "locality"){
              this.newArticle.city = locationInstance.long_name;
            }
            if(locationInstance.types[0] == "country" || locationInstance.types[0] == "administrative_area_level_1"){
              this.newArticle.country = locationInstance.long_name;
            }
          }
        }
      }
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.center = marker;
        this.newArticle.latitude = marker.lat;
        this.newArticle.longitude = marker.lng;
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
        console.log(this);
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    geolocateInitial: function(callback) {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        callback();
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

      // Filter system files or hide files
      if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
        return prevent()
      }

      // Filter php html js file
      if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
        return prevent()
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
