[ ![Codeship Status for nfurfaro/Trails4.0](https://app.codeship.com/projects/8fbb4110-e5e2-0134-052a-32055ecf3473/status?branch=develop)](https://app.codeship.com/projects/206677)


# Trail Alert

This is an sms-notification service for the local nordic ski-trails in Golden, B.C.

## Motivation

I wanted to undertake a slightly more involved app with this project to deepen my learning. This idea came up in conversation as something that would be a convenient service to have and not be too difficult for me to build, while forcing me to learn a lot of stuff I had never worked with before.

## About

The front-end for this project is a single-page app written in javascript/React. I chose to learn & utilize the Serverless Framework as my starting point, making use of Amazon Web Services and Twilio for my infrastructure.

The app consists of 1 DynamoDB table to store user's mobile numbers, and one table to store the recent trail conditions. In total, there are 4 Lambdas at play. I also made use of s3, cloudfront, and API Gateway.

The first Lambda is responsible for adding a new user's number to the db and sending a confirmation text through Twilio.

The second Lambda fires on a schedule, scraping the nordic club website for the trail-grooming conditions. Each time it runs, it compares the newly scraped data with the existing data in the db, updating the db if the website data has changed since the last db update.

The third Lambda is triggered by a Dynamodb stream each time the db table is updated, and is responsible for getting the trail data from one db table, the mobile numbers from the second db table, and sending out the sms messages to the subscribers by iterating over the list of numbers, using the trail data as the message body.

The fourth Lambda is responsible for deleting user numbers from the db when someone cancels their subscriptions. I chose to keep it simple, making use of Twilio's built-in Opt-out functionality. A user just has to reply to a notification with "Stop" to unsubscribe from the messaging-service on Twilio's end. A webhook triggers the "Delete" lambda, which handles the actual removal of the mobile number from the db.

## Deployment

I'm using git (with the gitflow branching model) for my version-control, so the deployment-process is kicked off by pushing to my github repo. A push to my "develop" branch will deploy to my "dev" stage AWS infrastructure, while a push to my "master" branch will deploy to my "production" stage. Each time I push to my repo, the corresponding (dev or production) Codeship deployment pipeline is triggered. This is where Serverless is installed globally, and project dependencies are installed. The stack is deployed to AWS first, and then the front-end app is built and deployed to it's own s3 bucket. Finally, a cloudfront invalidation is created to clear the cached data.
Testing isn't set up yet, but will be incorporated into the Codeship phase, just before deployment.

## Credits:

* Create-React-App (https://github.com/facebookincubator/create-react-app)
* material-ui (http://www.material-ui.com/#/)
* x-ray (https://github.com/lapwinglabs/x-ray)
* async (https://github.com/caolan/async)
* superagent (https://github.com/visionmedia/superagent)
* node-cipher (https://github.com/nathanbuchar/node-cipher)


## License

[the Unlicense](http://unlicense.org)
