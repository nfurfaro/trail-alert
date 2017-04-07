var async = require('async');
var AWS = require('aws-sdk');
var twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
var twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

AWS.config.update({ region: 'us-east-1' });

exports.sendSmsMessages = sendSmsMessages;
function sendSmsMessages (event, context, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    async.waterfall([
        function (callback) {
            var params = {
                TableName: 'Grooming-Reports-dev',
                Key: {
                    ID: 'Recently Groomed'
                }
            };
            docClient.get(params, (err, status) => {
                if (err) console.log(err, err.stack);
                else callback(null, status);
            });
        },
        function (status, callback) {
            var paramsGetNums = {
                TableName : 'User-Mobile-Numbers-dev',
                AttributesToGet: [
                    'mobileNumber'
                ]
            };
            docClient.scan(paramsGetNums, function (err, nums) {
                if (err) console.log(err, err.stack);
                else callback && callback(null, nums, status.Item.Status);
            });
        }
    ],
        function (err, nums, status) {
            var mobileNums = nums.Items;
            var Nums = mobileNums.map(number => number.mobileNumber);

            for (var num of Nums) {
                var sms = {
                    to: num,
                    body: status,
                    from: twilioPhoneNumber
                };
                var twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

                twilioClient.messages.create(sms, function (error, data) {
                    if (error) {
                        var errResponse = {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Credentials' : true
                            },
                            statusCode: error.status,
                            body: {
                                message: error.message,
                                error: error
                            }
                        };

                        return callback && callback(null, JSON.stringify(errResponse));
                    }
                    console.log(`message: ${data.body}`);
                    console.log(`date_created: ${data.date_created}`);

                    var response = {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials' : true
                        },
                        body: {
                            message: 'Text message successfully sent!',
                            data: data
                        }
                    };
                    return callback && callback(null, JSON.stringify(response));
                });
            }
        });
}
// sendSmsMessages()
