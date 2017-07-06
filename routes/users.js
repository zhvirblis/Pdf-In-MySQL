var express = require('express');
var router = express.Router();
var con = require('../db/dbConnection');
var PDFDocument = require('pdfkit');
var fs = require('fs');

router.get('/', function(req, res) {
  if (req.query.firstname) {
    var sql = 'SELECT * FROM users WHERE firstname = ?';
    con.query(sql, req.query.firstname , function(err, result) {
      if (err) {
        res.json({result: false});
      }
      if (!result || !result[0]) {
        res.json({result: false});
      } else {
        makePDF(result, function(err) {
          if (err) {
            res.json({result: false});
          }
          res.json({result: true});
        });
      }
    });
  } else {
    res.json({error: 'empty firstname'});
  }
});

function makePDF(user, done) {
  var doc = new PDFDocument;
  doc.text(user[0].firstName + ' ' + user[0].lastName, {
      align: 'left'
    });
  doc.image(user[0].image, 320, 15, {fit: [100, 100]});
  var buffers = [];
  doc.on('readable', function() {
    let chunk;
    while (null !== (chunk = doc.read())) {
      buffers.push(chunk);
    }
  });
  doc.on('end', function() {
    var pdf = Buffer.concat(buffers);
    con.query('UPDATE users SET pdf=? WHERE firstName=?',
    [pdf, user[0].firstName],
     function(err, user) {
      if (err) {
        return done(err);
      }
      return done(null);
    });
  });
  doc.end();
}
module.exports = router;
