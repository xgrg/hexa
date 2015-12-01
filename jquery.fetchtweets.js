/**
 * Queries grabtweets.php for a list of tweets pre-stored in twitter-json.txt
 * On success returns a JSON containing these tweets, filters them, formats them,
 * and adds them in a given section (using its id)
 */

function loadtweets(hashtag){
    request = {
       q:'cache',
       count : 0,
       api:'cache',
       hashtag:''
    }
    var response = '';
    $.ajax({
        url: 'grabtweets.php',
        type: 'POST',
        dataType: 'json',
        data:  request,
        success : function(text){
           response = text;
           how_long_with_nomeat(response);
	   what_did_i_learn(response);
	   what_did_i_read(response);
	   what_did_i_try(response);
	   what_did_i_dream(response);
	   where_have_i_been(response);
           return response;
        }
    });
}


/**
 * Takes a JSON (e.g. returned by fetchtweets) and filter the tweets according
 * to a given hashtag.
 * Returns an array containing these filtered tweets.
 */

function filtertweets(data, hashtag){
   data = jQuery.parseJSON(data);
   res = [];
   try {
     // append tweets into page
     for (var i in data){
        hashtags = [];
        h =  data[i].entities['hashtags'];
        for (var j = 0; j < h.length; j++)
           hashtags.push(h[j]['text']);
        if ($.inArray(hashtag, hashtags) != -1 || hashtag === ''){
           res.push(data[i]);
        }
     }
   }
   catch(e){
   }
   return res;
}


/**
 * Converts a date string to the "ago" format
 */

function timeAgo(dateString) {
       var rightNow = new Date();
       var then = new Date(dateString);

       //if ($.browser.msie) {
           // IE can't parse these crazy Ruby dates
       //    then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
       //}

       var diff = rightNow - then;

       var second = 1000,
       minute = second * 60,
       hour = minute * 60,
       day = hour * 24,
       week = day * 7;

       if (isNaN(diff) || diff < 0) {
           return ""; // return blank string if unknown
       }

       if (diff < second * 2) {
           // within 2 seconds
           return "right now";
       }

       if (diff < minute) {
           return Math.floor(diff / second) + " seconds ago";
       }

       if (diff < minute * 2) {
           return "about 1 minute ago";
       }

       if (diff < hour) {
           return Math.floor(diff / minute) + " minutes ago";
       }

       if (diff < hour * 2) {
           return "about 1 hour ago";
       }

       if (diff < day) {
           return  Math.floor(diff / hour) + " hours ago";
       }

       if (diff > day && diff < day * 2) {
           return "yesterday";
       }

       if (diff < day * 365) {
           return Math.floor(diff / day) + " days ago";
       }

       else {
           return "over a year ago";
       }
   } // timeAgo()


/**
  * The Twitalinkahashifyer!
  * http://www.dustindiaz.com/basement/ify.html
  * Eg:
  * ify.clean('your tweet text');
  */
var ify = {
  link: function(tweet) {
    return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
      var http = m2.match(/w/) ? 'http://' : '';
      return '';//<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
    });
  },

  at: function(tweet) {
    return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
      return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
    });
  },

  list: function(tweet) {
    return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
      return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
    });
  },

  hash: function(tweet) {
    return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
      return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
    });
  },

  clean: function(tweet) {
    return this.hash(this.at(this.list(this.link(tweet))));
  }
}; // ify


/**
 * Takes an array of tweets and returns a formatted version of each,
 * as an array of strings
 */

function formattweets(data){
   var template = '<div class="item">{IMG}<div class="tweet-wrapper"><span class="text">{TEXT}</span>\
           <span class="time"><a href="{URL}" target="_blank">{AGO}</a>{LOC}</span>\
           by <span class="user">{USER}</span></div></div>';
   res = [];
   for (var i in data){
      img = '';
      loc = '';
      url = 'http://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str;
      try {
         if (data[i].place && data[i].place != 'null') {
           loc = ' from <a href="http://maps.google.com/?q={LOC}">{LOC}</a>'
           loc = loc.replace('{LOC}', data[i].place['full_name']);
           loc = loc.replace('{LOC}', data[i].place['full_name']);
         }
      } catch (e) {
      //no media
     }
      var usermap = {};
      usermap["Cha30092012"] = "Cha";
      usermap["EduWenca"] = "Greg";
      usermap["WencaLog"] = "Edu Wenca"
      res.push(template.replace('{TEXT}', ify.clean(data[i].text) )
           .replace('{USER}', usermap[data[i].user.screen_name])
           .replace('{IMG}', img)
           .replace('{AGO}', timeAgo(data[i].created_at) )
           .replace('{LOC}', loc )
           .replace('{URL}', url )
           );
   }
   return res;
}

/**
 * Appends a list of tweets to a given section in a page (using its id)
 * The tweets must have been previously formatted, e.g. using formattweets
 */

function appendTo(tweets, id){
   for (var i in tweets){
      $(id).append(tweets[i]);
   }
}


/**
 * 
*/

function how_long_with_nomeat(data){
   nomeat = filtertweets(data, "meat");
   $("#nomeat").append("since " + timeAgo(nomeat[0].created_at));
};

function what_did_i_learn(data){
   learned = filtertweets(data, "learned");
   test = []
   test.push(learned[0]);
   $("#learned").append(formattweets(test));
}

function what_did_i_read(response){
   learned = filtertweets(data, "read");
   test = []
   test.push(data[0]);
   $("#read").append(formattweets(test));
}

function what_did_i_try(response){
   learned = filtertweets(data, "tried");
   test = []
   test.push(data[0]);
   $("#tried").append(formattweets(test));
}

function what_did_i_dream(response){
   learned = filtertweets(data, "dreamed");
   test = []
   test.push(data[0]);
   $("#dreamed").append(formattweets(test));
}

function where_have_i_been(response){

}
