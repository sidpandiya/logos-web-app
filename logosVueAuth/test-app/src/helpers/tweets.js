var twit = require('twitter');
var firebase = require('firebase')
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
let userTweetsRef = db.ref('userTweets');

var twitter = new twit({
  consumer_key: "Nw67gC9HxtwRzT7ATttSq6x28",
  consumer_secret: "gbf8hqfp9f5HsGrTpkhOVu7HWjD2ceBLxRN8XYTf149LwRP1rf",
  access_token_key: "1017669551998189568-cou64ahMdm45usAy4eCkwYjeoD0cw7",
  access_token_secret:"VtYrYpZu10zvLPm42EOkaoxWPgaWFXdGODSytzPT9frEs"
});

var screenName = "";
var url = "https://api.twitter.com/1.1/users/show.json";
var qURL = "";

twitter.get(url, {user_id: "1019268020022022144"}, function (error, response, body) {
    if (error) {
        console.log(error);
    }
	    var json = JSON.parse(body.body);
	    //screenName = json.screen_name;
	    
	    var seen = [];
    	screenName = "BernieSanders"
    	console.log("screenName is "+ screenName)
	    qURL = "https://api.twitter.com/1.1/search/tweets.json?q=from%3A" + screenName + "&lang=en";
    	console.log("call url is "+ qURL);
	    twitter.get(qURL, { count: 100}, function(error, response, body) {
	    	console.log("in the get loop")
			if (error) {
		        console.log(error);
		    }
		    var result = JSON.parse(body.body);
		    var tweets = result.statuses;
		    var hundredTweets = {};
		    for (i = tweets.length - 1; i >= 0; i--){
		    	var index = ((tweets.length - 1) - i);
		    	hundredTweets[""+index+""] = tweets[i].text;
			}
			userTweetsRef.child(screenName).set(hundredTweets);
			console.log("done with " + screenName);
			// console.log(userTweetsRef.child(screenName));
	   	})
	   	console.log("done 2");
   	}
);


// userTweetsRef.once('value', function(snapshot){
//     snapshot.forEach(function(_child){
//         var society = _child.key;
//         console.log(society);
//     });
// });

