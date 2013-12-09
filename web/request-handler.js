var path = require('path');
var fs = require('fs');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var sendResponse = function(request, response, data){
  response.writeHead(200, {
    'content-type': 'text/html'
  });
  response.end(data);
};

var addURL = function(request, response){

};

var servePage = function(request, response){
  sendResponse(request, response);
};

var router = {
  'GET': servePage,
  'POST': addURL
};

module.exports.handleRequest = function (req, res) {
  router[req.method].call(this, req, res);
  console.log(exports.datadir);
};