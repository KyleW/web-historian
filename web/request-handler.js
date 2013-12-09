var path = require('path');
var fs = require('fs');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

module.exports.handleRequest = function (request, response) {

  var sendResponse = function(request, response, data){
    response.writeHead(200, {
      'Content-Type':'text/html'
    });
    response.end(data);
  };

  var serveForm = function(request, response){
    sendResponse(request, response, fs.readFileSync('../web/public/index.html', 'utf8'));
  };

  var saveURL = function(){

  };

  var router = {
    'GET': serveForm,
    'POST': saveURL
  };

  router[request.method](request,response);
};