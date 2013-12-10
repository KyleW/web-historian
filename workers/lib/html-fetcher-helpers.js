// var http = require('http');
var fs = require('fs');
var path = require('path');
var http = require('http-request');


module.exports.datadir = path.join(__dirname, "../../data/sites.txt"); // tests will need to override this.
module.exports.pagedir = path.join(__dirname, "../../data/sites/"); // tests will need to override this.


exports.readUrls = function(filePath, cb){
  var parsedURLString = fs.readFileSync(filePath, 'utf8').split('\n');
  parsedURLString.pop();
  cb.call(this,parsedURLString);
};

exports.downloadUrls = function(){
  var urls;

  exports.readUrls(exports.datadir, function(urlArray){
    urls = urlArray;
  });

  console.log(urls); //debugging

  for ( var i = 0 ; i < urls.length ; i++){

    var file = exports.pagedir + urls[i];

    http.get({url: urls[i]}, file , function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
};