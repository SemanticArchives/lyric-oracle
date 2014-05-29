var mongoose = require('mongoose');
var apiKey = require('./api_key');
var http = require("http");

var mongoose = require('mongoose');

// Connect to Mongoose/MongoDB
mongoose.connect('mongodb://localhost/lyrics');

// Extract out models later...
var Song = mongoose.model('Song', {
  artist: String,
  album: String,
  song: String,
  lyrics: String,
  semantics: Object
});


//
// Worker function
//
function openCalaisEnrich (content, cb) {
    //
    // Set up the headers
    //
    var postOptions =
    {
        host      : "api.opencalais.com",
        port      : "80",
        path      : "/tag/rs/enrich",
        method    : "POST",
        headers   : {
            "Content-Type"              : "text/raw",
            "Content-Length"            : content.length,
            "x-calais-licenseID"        : apiKey.Key,
            "outputFormat"              : "Application/JSON",
            "enableMetadataType"        : "GenericRelations,SocialTags",
            "calculateRelevanceScore"   : "true"

        }
    };

    // Set up the request
    setTimeout(function() {
      var postRequest = http.request(postOptions, function(res)
      {
          res.setEncoding("utf8");

          var response = "";
          res.on("end", function() {
          cb(null, JSON.parse(response));
          });
          res.on("data", function (chunk) {
            response += chunk;
          });
      });
      postRequest.write(content);
      postRequest.end();
    }, 1000);
}

//
// Entry-point
//

// For every document in Mongoose, submit it to the OpenCalais black box
// and get good things. Put good things back in the database.
Song.find({}, null, function(err, docs) {
    docs.forEach(function(doc) {
        openCalaisEnrich(doc.lyrics, function (err, json) {
          if(!err) {
            doc.semantics = json;
            doc.save(function(err) {
              if (err) {
                console.log('Error saving lyrics for ' + doc.song + '. Error: ' + err);
              }
            });
          } else {
            console.log('Error! Bad things happening with API call. ' + err);
          }
        });
    });
});
