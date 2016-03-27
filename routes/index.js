var express = require('express');
var ibmdb = require('ibm_db');
var Promise = require('promise');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var connectionString = "DRIVER={DB2};DATABASE=mydb;UID=db2inst1;PWD=root;HOSTNAME=140.119.19.19;port=50001";
  var open = new Promise(function(resolve, reject){
    ibmdb.open(connectionString, function(err, conn){
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });

  var qq = new Promise(function(resolve, reject){
    open.then(function(conn){
      conn.query('SELECT * FROM student', function(err, data){
        if (err) {
          reject(err);
          conn.close(function () {
            console.log('db closed');
          });
        } else {
          resolve(data);
          conn.close(function () {
            console.log('db closed');
          });
        }
      });
    });
  });

  qq.then(function(data, err){
    res.render('index', {
      data : data
    });
  },function(err){
    console.log(err);
    res.render('index', {
      data : err
    });
  });


});

module.exports = router;
