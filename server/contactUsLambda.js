const CONTACT_ADDRESS = 'hello@horizon-explorer.com';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

module.exports.contact = (event, context, callback) => {
  console.log(event.body)
  const body = JSON.parse(event.body);

  const params = {
    Destination: {
      ToAddresses: [CONTACT_ADDRESS]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `FROM: ${body.from}

${body.message}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email'
      }
    },
    Source: CONTACT_ADDRESS
  }


  // Create the promise and SES service object
  new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise()
    .then(
      data => {
        console.log(data);
        callback(null, {statusCode: 200, body: "{\"successMessage\": \"Message Sent.\"}", headers: {'Access-Control-Allow-Origin': '*'}})
      },
      err => callback(err)
    )
};

// For testing:
/*module.exports.contact({body: querystring.stringify({ from: 'somecustomer@somecompany.com', subject: 'test', message: 'This is some message'})},
  null , (err, success) => console.log('Callback called with args: ', err, success)
  )
 */
