var express = require('express');
var Promise = require('promise');
var ibmdb = require('ibm_db');
var prettyjson = require("prettyjson");

var router = express.Router();

router.post('/', function(req, res, next) {

  var connectionString =  'DRIVER={DB2};DATABASE=mydb;';
      connectionString += 'UID=' + req.body.uid +';PWD='+ req.body.pwd +';';
      connectionString += 'HOSTNAME=140.119.19.19;port=50001;';

  var openDB = new Promise(function(resolve, reject){
    ibmdb.open(connectionString, function(err, conn){
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });

  openDB.then(function(dbInstance){
      console.log('DB2 Connected!');
      res.json(dbInstance);
      dbInstance.close(function () {
        console.log('db closed');
      });
  }, function(err){
    console.log(err);
    res.json(err);
  });

});

module.exports = router;
