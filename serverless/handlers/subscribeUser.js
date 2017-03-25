var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
var twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
var twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

exports.subscribe = subscribe;
function subscribe(event, context, callback) {

// ----------------------------------------------------------
// for local testing only!
    // var event = {
    //   "queryStringParameters": {
    //     "mobileNum": 2222222222,
    //     "httpStatus": 200
    //   }
    // }
// ----------------------------------------------------------

  var responseCode = 200;
  console.log("request: " + JSON.stringify(event));
  var mobileNum = event.queryStringParameters.mobileNum;

  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
    if (event.queryStringParameters.mobileNum !== undefined && event.queryStringParameters.mobileNum !== null && event.queryStringParameters.mobileNum !== '') {
      console.log('Received mobileNum:: ' + event.queryStringParameters.mobileNum);
      mobileNum = Number(event.queryStringParameters.mobileNum);
    }
    if (event.queryStringParameters.httpStatus !== undefined && event.queryStringParameters.httpStatus !== null && event.queryStringParameters.httpStatus !== '') {
    console.log('Received http status: ' + event.queryStringParameters.httpStatus);
      responseCode = Number(event.queryStringParameters.httpStatus);
    }
  }
  function isNumber(o) {
    return typeof o == 'number' || (typeof o == 'object' && o.constructor === Number);
  }

  var timestamp = new Date().getTime();

  if (!isNumber(mobileNum)) {
    console.error('Number Validation Failed (Type error)');
    return (new Error('(typeof mobileNum !== "number")'));
  }

  var params = {
    TableName: 'User-Mobile-Numbers-dev',
    Key: {
      HashKey: 'mobileNumber',
    },
    Item: {
       'Timestamp': timestamp,
       'mobileNumber': mobileNum,
    },
  };

  var docClient = new AWS.DynamoDB.DocumentClient();

  docClient.put(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else
    var responseBody = {
        message: 'User Number: ' + mobileNum + ' subscribed to service!',
        input: event
        };
        var response = {
            statusCode: responseCode,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true,
            },
            body: responseBody
        };
        console.log("response: " + JSON.stringify(response))

        const sms = {
          to: mobileNum,
          body: 'You have successfully subscribed to the "Trail Alert" notification service. To un-subscribe, reply with:   stop   ',
          from: twilioPhoneNumber
        };

        const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

        twilioClient.messages.create(sms, function(error, data) {
            if (error) {
                const errResponse = {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Access-Control-Allow-Credentials" : true
                    },

                    statusCode: error.status,
                    body: {
                        message: error.message,
                        error: error
                }};
                callback && callback(JSON.stringify(errResponse));
                console.log(`error: ${errResponse}`);
                callback && callback(error, errResponse);
            }

            else  {
                console.log(`message: ${data.body}`);
                console.log(`date_created: ${data.date_created}`);

                const response = {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Access-Control-Allow-Credentials" : true
                    },
                    body: JSON.stringify({
                        message: 'Text message successfully sent!',
                        data: data
                    }),
                };

                callback && callback(null, response);
            }
        });
    });
}
// subscribe()