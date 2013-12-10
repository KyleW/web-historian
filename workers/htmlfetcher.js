// eventually, you'll have some code here that uses the tested helpers
// to actually download the urls you want to download.

var fs = require('fs');
var helpers = require('./lib/html-fetcher-helpers.js');

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
module.exports.pagedir = path.join(__dirname, "../data/sites/"); // tests will need to override this.



var page = helpers.downloadUrls();

console.log(page);


fs.writeFile(filePath+url[i], page, 'utf8', function(err){
          if(err) throw err;
});