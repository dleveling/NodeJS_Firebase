const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./nodejsfb-52980-firebase-adminsdk-jai5r-bb93f8507c.json')
const databaseURL = 'https://nodejsfb-52980.firebaseio.com'
const URL = 'https://fcm.googleapis.com/v1/projects/nodejsfb-52980/messages:send'
const deviceToken = 'eYxi4nGc8bw:APA91bEqfcjHfqLoGpcelycJb2P3WQ5YFXiQlUPTFcWtLGZs25Pg-ffTcI8t-0FTtOvEKooKmnbSPZFsZR-4Tuyn8BAavPgodT3PdDK2r1ZY4dMA6_1lkMWkLiVOMZJ5BotsCwRcCBjg'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Hello NodeJS',
        body: 'NodeJS Is real'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()