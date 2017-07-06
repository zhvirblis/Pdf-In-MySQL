var mysql = require('mysql');
var config = require('config');
var dbConfig = config.get('dbConfig');

var con = mysql.createConnection(dbConfig);

con.connect(function(err) {
  if (err) { throw err; }
  console.log('Connected!');
});

module.exports = con;
