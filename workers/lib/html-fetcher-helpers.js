// var http = require('http');
var fs = require('fs');
var path = require('path');
var http = require('http-request');
var mysql = require('mysql');


module.exports.datadir = path.join(__dirname, "../../data/sites.txt"); // tests will need to override this.
module.exports.pagedir = path.join(__dirname, "../../data/sites/"); // tests will need to override this.


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'pagesDatabase'
});

///////////////////////////////////////////////////

exports.readUrls = function(filePath, cb){
  var parsedURLString = fs.readFileSync(filePath, 'utf8').split('\n');
  parsedURLString.pop();
  cb.call(this,parsedURLString);
};

exports.downloadUrls = function(){

  connection.connect();

  connection.query('SELECT url FROM pages', function(err, rows, fields) {
    if (err) throw err;

    //GET OUR URLS FROM THE DB AND ADD TO A STRING
    for (var i = 0; i < rows.length ; i++){
    // Pull Down the page for each url
      var curURL = rows[i].url;

      http.get(curURL, function (err, res) {

        console.log(curURL);

        if (err) {console.error(err);}

        var pageData = res.buffer.toString();
        pageData = connection.escape(pageData);

        var insertQuery = "UPDATE pages SET body = "+pageData+" WHERE url ='"+curURL+"';";
        // console.log(insertQuery);


      // Store the page in the db
        connection.query( insertQuery, function(err, rows, fields) {
          if (err) throw err;
          console.log('this is running your query.');
        });
        // connection.end();
      });
    }
  });
};
