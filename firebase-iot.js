// Import the Firebase Admin SDK
const admin = require('firebase-admin');

// Replace with the path to your service account key JSON file
const serviceAccount = require('./iot-sever-c8192-firebase-adminsdk-fbsvc-49042e2e58.json');

// Initialize the Firebase Admin app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-sever-c8192-default-rtdb.europe-west1.firebasedatabase.app/"
});

// Get a reference to the database
const db = admin.database();

/**
 * Sends data to a specified "topic" (i.e. node) in the Realtime Database.
 * @param {string} topic - The topic name (node name) to which data will be written.
 * @param {object} data - The data object to send.
 */
function sendDataToTopic(topic, data) {
  const ref = db.ref(`topics/${topic}`);
  ref.set(data, (error) => {
    if (error) {
      console.error("Data could not be saved:", error);
    } else {
      console.log(`Data successfully sent to topic '${topic}':`, data);
    }
  });
}

/**
 * Listens for changes on a specified "topic" and processes the received data.
 * @param {string} topic - The topic name (node name) to listen to.
 */
function listenToTopic(topic) {
  const ref = db.ref(`topics/${topic}`);
  ref.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log(`Data received on topic '${topic}':`, data);
    // Add your custom logic here to process the received data.
  }, (error) => {
    console.error(`Error listening to topic '${topic}':`, error);
  });
}

// Example usage:

// Define a topic name
const topicName = "weather";

// Send data 11 times, once every second
for (let i = 0; i < 11; i++) {
  setTimeout(() => {
    const sensorData = {
      temperature: 36.5,
      humidity: 23,
      // Generate a fresh timestamp for each message
      timestamp: Date.now()
    };
    sendDataToTopic(topicName, sensorData);
  }, i * 1000); // Each iteration is delayed by i*1000 ms
}

// Uncomment to listen for changes on the same topic
// listenToTopic(topicName);