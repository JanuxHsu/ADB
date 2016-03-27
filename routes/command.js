var express = require('express');
var Promise = require('promise');
var ibmdb = require('ibm_db');
var router = express.Router();

router.post('/', function(req, res, next) {
  var connectionString = "DRIVER={DB2};DATABASE=mydb;UID=db2inst1;PWD=root;HOSTNAME=140.119.19.19;port=50001";
  var queryString = req.body.sqlString;
  var open = new Promise(function(resolve, reject){
    ibmdb.open(connectionString, function(err, conn){
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });


  var connect = new Promise(function(resolve, reject){
    open.then(function(conn){
      conn.query(queryString, function(err, data){
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

  connect.then(function(data, err){
    console.log(data);
    res.json({
      status : 'success'
    });
  },function(err){
    console.log(err);
    res.json({
      status : err
    });
  });


});

module.exports = router;
