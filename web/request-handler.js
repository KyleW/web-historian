var path = require('path');
var fs = require('fs');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
module.exports.htmldir = path.join(__dirname, "./public/index.html");

var sendResponse = function(request, response, data){
  response.writeHead(200, {
    'content-type': 'text/html'
  });
  response.end(data);
};

var addURL = function(request, response){

};

var servePage = function(request, response){
  fs.readFile(exports.htmldir,function(err,data){  //Spec runner version
  // fs.readFile('./public/index.html',function(err,data){
      sendResponse(request, response, data);
  });
};

var router = {
  'GET': servePage,
  'POST': addURL
};

module.exports.handleRequest = function (req, res) {
  router[req.method].call(this, req, res);
  console.log(exports.datadir);
};