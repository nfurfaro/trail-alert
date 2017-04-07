var async = require('async');
var Xray = require('x-ray');
var AWS = require('aws-sdk');

AWS.config.update({ region:'us-east-1' });

// -----------------------------------------------------------
// // testing only
// var URL = 'http://goldennordicclub.ca/conditions/';
// var SELECTOR_4 = 'p:nth-child(4)';
// var SELECTOR_2 = 'p:nth-child(2)';
// -----------------------------------------------------------

var URL = process.env.URL_TO_SCRAPE;
var SELECTOR_4 = process.env.HTML_SELECTOR_4;
var SELECTOR_2 = process.env.HTML_SELECTOR_2;

exports.scrape = scrape;
function scrape (event, callback) {
    var x = Xray();
    var docClient = new AWS.DynamoDB.DocumentClient();

    async.parallel([
        function (callback) {
            x(URL, SELECTOR_4)(function (err, status) {
                console.log('Scraped Status: ' + status);
                callback(null, status);
            });
        },
        function (callback) {
            x(URL, SELECTOR_2)(function (err, date) {
                console.log('Scraped Date: ' + date);
                callback(null, date);
            });
        }],
      function (err, results) {
          var newStatus = results[0];
          var newDate = results[1];
          var paramsGet = {
              TableName : 'Grooming-Reports-dev',
              Key: {
                  ID: 'Recently Groomed'
              }
          };

          var paramsPut = {
              TableName : 'Grooming-Reports-dev',
              Key: {
                  HashKey: 'ID'
              },
              Item: {
                  'ID': 'Recently Groomed',
                  'Date': newDate,
                  'Status': newStatus
              }
          };
          docClient.get(paramsGet, function (err, data) {
              if (err) console.log(err, err.stack);
              else console.log('Returned by Get: ' + data.Item.Date + ' ' + data.Item.Status);
              if (data.Item.Date === newDate && data.Item.Status === newStatus) return null;
              else {
                  docClient.put(paramsPut, function (err, data) {
                      if (err) console.log(err, err.stack);
                      else console.log(data);
                  });
              }
          });
      });
}
// scrape()

