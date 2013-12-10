//ADD MODULES
var path = require('path');
var fs = require('fs');
var url = require('url');


//SET PATHS
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
module.exports.htmldir = path.join(__dirname, "./public/index.html");
module.exports.storedSites = path.join(__dirname, "../data/sites/");




// GET AND POST HANDLERS

var handlePost = function(request, response){
  var body = '';

  request.on('data', function(chunk){
    body += chunk;
  });

  request.on('end', function(){
    var targetURL =  body.split('=')[1];
    var htmlLoc = path.join(exports.storedSites,targetURL);
    fs.readFile(htmlLoc,function(err,urlData){
      if(err) {
        addURL(targetURL);
        sendResponse(request,response,"We've saved your request.",302);
      } else {
        sendResponse(request,response,urlData,302);
      }
    });
  });
};

var handleGet = function(request, response){
  var reqURL = url.parse(request.url);
  if(reqURL.pathname === "/"){ serveIndex(request,response);}
  else {
    var siteToFind = reqURL.pathname.split("/")[1];
    returnSavedPage(request, response, siteToFind);
  }
};

var fetchURL = function(request){
  var body = '';
  request.on('data', function(chunk){
    body += chunk;
  });

  request.on('end', function(){
    var targetURL =  body.split('=')[1];
    addURL(targetURL);
  });
};

var addURL = function(targetURL){
  fs.appendFile(exports.datadir, targetURL + '\n', function(err){
      if(err) throw err;
  });
};



// TYPES OF PAGES TO RETURN

var serveIndex = function(request, response, reqURL){
  fs.readFile(exports.htmldir,function(err,data){
    sendResponse(request, response, data);
  });
};

var returnSavedPage = function(request, response, requestedURL) {
  var htmlLoc = path.join(exports.storedSites,requestedURL);
  fs.readFile(htmlLoc,function(err,urlData){
    if(err) {
      sendResponse(request,response,"",404);
    } else {
      sendResponse(request,response,urlData,200);
    }
  });
};



// SEND RESPONSE
var sendResponse = function(request, response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, {
    'content-type': 'text/html'
  });
  response.end(data);
};

//ROUTER
var router = {
  'GET': handleGet,
  'POST': handlePost
};

module.exports.handleRequest = function (req, res) {
  router[req.method].call(this, req, res);
  // handlePost(req,res);
  console.log(exports.datadir);
};
