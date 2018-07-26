<!-- LOGOS APP VIEW -->
<!-- This file contains most of the logic that handles all form input -->

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
      <!-- This shows any errors that could have been encountered when filling out the form -->
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
          <!-- Google Map Component Integration -->
          <gmap-map :center="center" :zoom="12" style="width:100%;  height: 400px;">
              <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position"
                @click="center=m.position"></gmap-marker>
          </gmap-map>
          <div class="form-group">
              <label for="articleBody">Body:</label>
              <!-- Quill Editor Integration -->
              <vue-editor id="articleBody" v-model="newPostContent.content"></vue-editor>
          </div>
          <!-- Media Upload -->
          <div class="form-group">
              <!-- creates a button that says "choose file" and starts as "No file chosen" -->
              <input id="photo" class="image-select" type="file" accept="image/png, image/jpeg">
          </div>
          <input id="submit" type="submit" class="btn btn-primary image-submit" value="Post">
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
              <th>Title:</th>
              <th>Author ID:</th>
              <th>Body:</th>
              <th>Location:</th>
              <th>Date Added:</th>
              <th>Views:</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post, key) in posts" >
              <td >{{ post.title }}</td>
              <td v-for="pair in nameArticlePairs" v-if="pair.piD == post.userId && pair.iD == post['.key']">{{ pair.name }}</td>
              <td v-for="pair in nameArticlePairs" v-if="pair.iD == post['.key']" v-html="pair.body">{{ pair.body }}</td>
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

var firebase = require('firebase/app');
var underscore = require('underscore');

require('firebase/auth');
require('firebase/database');

var config = {
    apiKey: "AIzaSyD57NYPtxbNb6qnSOo7lg0mtD-id7Da0hw",
    authDomain: "logos-app-915d7.firebaseapp.com",
    databaseURL: "https://logos-app-915d7.firebaseio.com",
    projectId: "logos-app-915d7",
    storageBucket: "logos-app-915d7.appspot.com",
    messagingSenderId: "112244798411"
};

let app = firebase.initializeApp(config);
let db = app.database();

// make references to collections that need to be edited
let usersRef = db.ref('user');
let postsRef = db.ref('posts');
let postContentRef = db.ref('postcontent');
let userTweetsRef = db.ref('userTweets');
// Reference for Media Upload
let imageStoreRef = firebase.storage().ref();

// upload image to firestore update media field
// this is very "hacky" as if the setTimout starts executing the function before
// the page loads, the event listener will not be attached to the respective DOM elements
// setTimeout(function(){ 
//   document.querySelector(".image-select").addEventListener("change", handleFileUploadChange);
//   document.querySelector(".image-submit").addEventListener("click", handleFileUploadSubmit);
// }, 10000);

var currentUser = "";
var currentUserID = "";
var currame = "";

firebase.auth().onAuthStateChanged((function(user) {
  if (user) {
    currentUser = user.displayName;
    currentUserID = user.uid;
    //console.log(currentUserID);

  } else {
    // No user is signed in.
  }
}));

export default {
  name: 'create',
  firebase: {
    users: usersRef,
    posts: postsRef,
    postContent: postContentRef
  },
  components: {
    VueEditor
  },
  computed: {
    nameArticlePairs(){
      let toReturn = [];
      let $this = this;
      postsRef.on('value', function(snapshot) {
        snapshot.forEach(function(post){
          const child = post.val();
          child.id = post.key;
          //console.log(child.id);
          let pId = post.val().userId;
          //console.log("pId: " + pId);
          let associatedName = $this.getName(pId);
          //console.log("name: " + associatedName);
          let concatenatedContent = $this.getContent(child.id);
          var userNamePostIdObj = {iD: child.id, body: concatenatedContent, piD: pId, name: associatedName}
          var found = toReturn.some(function (el) {
            return ((el.iD === child.id));
          });
          if (!found) { 
            toReturn.push(userNamePostIdObj); 
          }

        });
      });
      //console.log(toReturn);
      return toReturn;
    },
    bodiesParsed(){
      let $this = this;
      let toReturn = [];
      postsRef.on('value', function(snapshot) {
        snapshot.forEach(function(post){
          const child = post.val();
          child.id = post.key;
          let concatenatedContent = $this.getContent(child.id);
          var newBodyObj = {iD: child.id, body: concatenatedContent};
          var found = toReturn.some(function (el) {
            return el.iD === child.id;
          });
          if (!found) { 
            toReturn.push(newBodyObj); 
          }
        });
      });
      //console.log(toReturn);
      return toReturn;
    }

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
      newPostContent: {
        postId: '',
        content: ''
      },
      posts: postsRef,
      center: { lat: 0, lng: 0 },
      markers: [],
      places: [],
      currentPlace: null,
      files: [],
      errors: [],
      pContent: ""
    }
  },
  mounted() {
    this.geolocateInitial(this.checkUser);
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
          currentUser = user.displayName;
          currentUserID = user.uid;
          //console.log(currentUserID)

          usersRef.orderByChild("socialId").equalTo(currentUserID).on('value', function(snapshot) {
            if (snapshot.exists()) {
              inDB = true;
            }
          });
          //console.log(inDB);
          if(!inDB){
            $this.addUser(userObject, currentUserID);
          }

        } else {
          // No user is signed in.
        }
      }));
    },
    getName: function(userId){
      //console.log("Input: " + userId);
      var toReturn = "Anon";
      usersRef.on('value', function(snapshot) {
        snapshot.forEach(function(users){
          //console.log(users.val());
          if(users.val().socialId == userId){
            //console.log("1: " + userId);
            //console.log("2: " + users.val().socialId)
            toReturn = users.val().name;
            return toReturn;
          } 
          
        });
      });
      return toReturn;
    },
    getContent: function(pId){
      //console.log(pId);
      var toReturn = "";
      postContentRef.on('value', function(snapshot) {
        snapshot.forEach(function(pContent){
          if(pContent.val().postId == pId){
            //console.log(pContent.val().content)
            toReturn = toReturn + " " + pContent.val().content;
          }
        })
      });
      //console.log(toReturn);
      return toReturn;
    },
    checkForm: function(e) {
      this.errors = [];
      if(this.newPostContent.content.length < 5) {
        if(this.newPostContent.content.length < 1) {
          this.errors.push("Please fill in a valid title.");
        }
        this.errors.push("Please fill in the body with more characters.");
        return false;
      }
      if(this.newArticle.title.length < 1) {
        this.errors.push("Please fill in a valid title.");
        return false;
      }
      return true;
    },
    postArticle: function(){
      this.checkUser();
      var location = this.newArticle.city + ", " + this.newArticle.country;
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const now = new Date().toLocaleDateString('en-US', options);
      this.newArticle.createdOn = now.toString();

      //sanitize inputs
      //console.log("Old location: " + location);
      var encodedLocation = this.$sanitize(location);
      var decodedLocation = encodedLocation.replace(/&amp;/g, '&');
      if(decodedLocation == "Enter a location." || decodedLocation.trim() == ""){
        decodedLocation = "Location unknown";
      }
      this.newArticle.location = decodedLocation;
      //console.log("New location: " + this.newArticle.location);

      //console.log("Old title: " + this.newArticle.title);
      var encodedTitle = this.$sanitize(this.newArticle.title);
      var decodedTitle = encodedTitle.replace(/&amp;/g, '&');
      this.newArticle.title = decodedTitle;
      //console.log("New title: " + this.newArticle.title);

      console.log("Old body: " + this.newPostContent.content);
      var backToTags = underscore.unescape(this.newPostContent.content);
      var str = this.$sanitize(backToTags);
      var result = str.replace(/\.+/g,'.|').replace(/\?/g,'?|').replace(/\!/g,'!|').split("|");
      console.log(result);
      
      console.log("Proto body: " + backToTags);
      console.log("New body: " + str);

      //console.log(this.newArticle.title.length);
      //console.log(this.newPostContent.content.length);

      //console.log("UID: "+ currentUserID);
      this.newArticle.userId = "" + currentUserID + "";

      if(this.checkForm(event) == true){
          var $this = this;
          if(document.getElementById("photo").files.length > 0){
            console.log("Trying to upload a file!");
            var selectedFile = document.querySelector(".image-select").files[0];
  
            console.log("go into submit handler");
            var uploadTask = imageStoreRef.child('images/' + selectedFile.name).put(selectedFile);
            uploadTask.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            }, (error) => {
              // Handle unsuccessful uploads
              console.log("upload error: " + JSON.stringify(error));
            }, () => {
              // Do something once upload is complete
              console.log("success");
              var urlString = "";
  
              imageStoreRef.child("images/" + selectedFile.name).getDownloadURL().then(function(url) {
                urlString = url;
                $this.newArticle.media = urlString;
  
                var newPost = postsRef.push($this.newArticle);
                var postId = newPost.key;
                for(var i = 0; i<result.length; i++){
                  $this.newPostContent.postId = postId;
                  $this.newPostContent.content = result[i];
                  postContentRef.push($this.newPostContent);
                  $this.newPostContent.postId = '';
                  $this.newPostContent.content = '';
                }
  
                $this.newArticle.title = '';
                $this.newArticle.media = '';
                $this.newArticle.city = "N/A";
                $this.newArticle.country = "N/A";
                $this.newArticle.createdOn = '';
              });
            });
  
              
  
              //setTimeout(function(){
              //  console.log("media update url: " + urlString);
              //}, 5000);
              document.getElementById("photo").value = "";
          } else {
            var newPost = postsRef.push($this.newArticle);
            var postId = newPost.key;
            for(var i = 0; i<result.length; i++){
              $this.newPostContent.postId = postId;
              $this.newPostContent.content = result[i];
              postContentRef.push($this.newPostContent);
              $this.newPostContent.postId = '';
              $this.newPostContent.content = '';
            }

            $this.newArticle.title = '';
            $this.newArticle.media = '';
            $this.newArticle.city = "N/A";
            $this.newArticle.country = "N/A";
            $this.newArticle.createdOn = '';
          }
      }
        
    },
    logOut() { 
        firebase.auth().signOut();
    },
    setPlace(place) {
      this.currentPlace = place;
      //console.log(place.address_components);
      //console.log(typeof(place.address_components));
      //console.log(place.address_components[1].short_name);
      //console.log(place.address_components[3].short_name);
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
        //console.log(document.getElementById("locationAutofill").innerHTML);
      })
    },
    addMarker() {
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        //console.log(this);
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
</style>
