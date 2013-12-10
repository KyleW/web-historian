var http = require('http');
var fs = require('fs');
var path = require('path');

module.exports.datadir = path.join(__dirname, "../../data/sites.txt"); // tests will need to override this.
module.exports.pagedir = path.join(__dirname, "../../data/sites/"); // tests will need to override this.


exports.readUrls = function(filePath, cb){
  var parsedURLString = fs.readFileSync(filePath, 'utf8').split('\n');
  cb.call(this,parsedURLString);
};

exports.downloadUrls = function(){
  var urls;

  exports.readUrls(exports.datadir, function(urlArray){
    urls = urlArray;
  });

  console.log(urls);

  for ( var i = 0 ; i < urls.length ; i++){
    var options = {
      hostname: urls[i],
      port: 80,
      method: 'GET'
    };

    var body;

    return http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        body += chunk;
      });

      return res.on('end', function(body){
        return body;
      });
    });
  }
};