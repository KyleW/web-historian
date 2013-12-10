var http = require('http');

exports.readUrls = function(filePath, cb){
  cb.call(this,fs.readFile(filePath));
};

exports.downloadUrls = function(urls , filePath){
  for ( var i = 0 ; i < urls.length ; i++){
    var options = {
      hostname: urls[i],
      port: 80,
      method: 'GET'
    };

    var body;

    http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        body += chunk;
      });

      res.on('end', function(body){
        fs.writeFile(filePath+url[i], data, 'utf8', function(err){
          if(err) throw err;
        });
      });
    });
  }
};