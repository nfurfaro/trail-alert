var AWS = require('aws-sdk');

AWS.config.update({ region:'us-east-1' });

exports.unsubscribe = unsubscribe;
function unsubscribe (event, context, callback) {
// ----------------------------------------------------------
// for local testing only!

    // var event = {
    //     'body': {
    //         'From': '+12222222222',
    //         'Body': 'stop'
    //     }
    // }

    // var event = {
    //     'From': '+12222222222',
    //     'Body': 'stop'
    // }
// ----------------------------------------------------------

    console.log(event)
    var From = event.body.From;
    var mobileNum = Number(From.slice(2, 12));
    console.log(mobileNum)
    console.log(typeof (mobileNum))
    var message = event.body.Body;
    console.log(message)
    console.log(typeof (message))

    var params = {
        TableName : 'User-Mobile-Numbers-dev',
        Key: {
            'mobileNumber': mobileNum
        }
    };

    var docClient = new AWS.DynamoDB.DocumentClient();
    var response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials' : true
        },
        body: {
            message: 'User Number Un-subscribed from service.'
        }
    };
    (message === 'STOP' || message === 'Stop' || message === 'stop') ? (
      docClient.delete(params, function (err, data) {
          if (err) console.log(err);
          else {
              (
          console.log(data)
        )
          }
      })
    ) : console.log('"stop" message not present.')
}
// unsubscribe()
