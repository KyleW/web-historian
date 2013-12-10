// eventually, you'll have some code here that uses the tested helpers
// to actually download the urls you want to download.

var fs = require('fs');
var helpers = require('./lib/html-fetcher-helpers.js');
var path = require('path');

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
module.exports.pagedir = path.join(__dirname, "../data/sites/"); // tests will need to override this.

console.log("htmlfetcher.js is running");
helpers.downloadUrls();

