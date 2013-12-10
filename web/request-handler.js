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
  fetchURL(request); //get the URL from the post and add the url to our list
  sendSuccess(request,response);

  //check if the file exists and either return or return success
  // if(requestedURL){
  //   returnSavedPage(request,response,requestedURL);
  // } else {
  // }
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

var sendSuccess = function(request, response){
  //send some sort of success page
  sendResponse(request,response,"We've Saved your request.",302);
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
