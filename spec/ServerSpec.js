var path = require('path');
var handler = require("../web/request-handler");
var stubs = require("./helpers/stubs");
var fs = require('fs');
var res;

handler.datadir = __dirname + "/testdata/sites.txt";
// handler.htmldir = path.join(__dirname, "../web/public/index.html");


// allows us to run tests async
function async(cb){
  waits(1000);
  runs(cb);
}

beforeEach(function(){
  res = new stubs.Response();
});

describe("Node Server Request Listener Function", function() {

  it("Should answer GET requests for /", function(done) {
    var req = new stubs.Request("/", "GET");
    handler.handleRequest(req, res);
    async(function(){
      expect(res._responseCode).toEqual(200);
      expect(res._data).toMatch(/<input/); // the resulting html should have an input tag
      expect(res._ended).toEqual(true);
      done();
    });
  });

  it("Should answer GET requests for archived websites", function(done) {
    var fixtureName = "www.google.com";
    var req = new stubs.Request("/" + fixtureName, "GET");
    handler.handleRequest(req, res);
    async(function(){
      expect(res._responseCode).toEqual(200);
      expect(res._data).toMatch(/google/); // the resulting html should have the text "google"
      expect(res._ended).toEqual(true);
      done();
    });
  });

  it("Should accept posts to /", function() {
    fs.writeFileSync(handler.datadir, ""); // reset the test file

    var url = "www.example.com";
    var req = new stubs.Request("/", "POST", {url: url});

    handler.handleRequest(req, res);
    async(function(){
      var fileContents = fs.readFileSync(handler.datadir, 'utf8');
      expect(res._responseCode).toEqual(302);
      expect(fileContents).toEqual(url + "\n");
      expect(res._ended).toEqual(true);
    });
  });

  it("Should 404 when asked for a nonexistent file", function(done) {
    var req = new stubs.Request("/arglebargle", "GET");
    handler.handleRequest(req, res);
    async(function() {
      expect(res._responseCode).toEqual(404);
      expect(res._ended).toEqual(true);
      done();
    });
  });

});
