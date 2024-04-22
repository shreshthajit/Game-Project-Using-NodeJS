const admin = require('firebase-admin');
var serviceAccount = require("../../firebase.json");

class FcmService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
      });
    }
  }

  async sendToIndividual({
    token,
    title,
    body,
    data = {},
    isHighPriority,
  }) {
    try {
      const payload = {
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          title,
          body,
        },
        android: {
          notification: {
            title,
            body,
          },
          // Priority of the message. Must be either `normal` or `high`.
          priority: 'high',
          collapseKey: '',
          ttl: 600, // Time-to-live duration of the message in seconds.
        },
        apns: {
          headers: {
            'apns-expiration': ((new Date().getTime() + 600) / 1000).toFixed(),
            'apns-priority': isHighPriority ? '10' : '5',
          },
        },
        token,
      };
      const response = await admin.messaging().send(payload);
      console.log('🚀 response', response);
      return true;
    } catch (error) {
      console.log('sendToIndividual notification error: ', error);
      return false;
    }
  }
}

async function sendNotification(payload) {
  try {
    const { title, body, token, isHighPriority, data, challengeId } = payload;

    // Send FCM Push Notification
    token &&
      body &&
      (await new FcmService().sendToIndividual({
        token,
        title,
        body,
        challengeId,
        data,
        isHighPriority,
        ttl: 600,
      }));
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { sendNotification };
