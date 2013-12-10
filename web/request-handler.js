var path = require('path');
var fs = require('fs');
var url= require('url');

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
module.exports.htmldir = path.join(__dirname, "./public/index.html");
module.exports.storedSites = path.join(__dirname, "../data/sites/");

var sendResponse = function(request, response, data){
  response.writeHead(200, {
    'content-type': 'text/html'
  });
  response.end(data);
};

var addURL = function(request, response){
  var body = '';
  request.on('data', function(chunk){
    body += chunk;
  });

  request.on('end', function(){
    fs.appendFile(exports.datadir, '\n'+body.split('=')[1], function(err){
      if(err) throw err;
    });
    sendResponse(request,response);
  });

};

var servePage = function(request, response){
  var reqURL = url.parse(request.url);

  if(reqURL.pathname === "/"){
    fs.readFile(exports.htmldir,function(err,data){
      sendResponse(request, response, data);
    });
  } else {
    var siteToFind = reqURL.pathname.split("/")[1];
    var htmlLoc = path.join(exports.storedSites,siteToFind);
    fs.readFile(htmlLoc,function(err,data){
      sendResponse(request, response, data);
    });
  }
};

var router = {
  'GET': servePage,
  'POST': addURL
};

module.exports.handleRequest = function (req, res) {
  router[req.method].call(this, req, res);
  console.log(exports.datadir);
};