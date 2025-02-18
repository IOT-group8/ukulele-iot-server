const mqtt = require('mqtt');

// Log that the MQTT client is starting
console.log("Starting MQTT client...");

// Connect to the MQTT broker (replace with your broker's URL if needed)
const client = mqtt.connect('mqtt://mosquitto:1883');

// When connected, log success and subscribe to the input topic
client.on('connect', () => {
  console.log('Connected to broker. MQTT server is running.');
  client.subscribe('sensor/raw', (err) => {
    if (!err) {
      console.log('Successfully subscribed to sensor/raw.');
    } else {
      console.error('Subscription error:', err);
    }
  });

  client.publish('sensor/raw', "Fuck u", (err) => {
    if (!err) {
      console.log(`Published processed data: Fuck u`);
    } else {
      console.error('Publish error:', err);
    }
  });
});

// Additional event listeners for better logging and troubleshooting
client.on('reconnect', () => {
  console.log('Reconnecting to the broker...');
});

client.on('offline', () => {
  console.log('MQTT client is offline.');
});

client.on('close', () => {
  console.log('Connection to broker closed.');
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});

// Listen for messages on the subscribed topic
client.on('message', (topic, message) => {
  // Convert the message (Buffer) to a string
  const rawData = message.toString();
  console.log(`Received message on ${topic}: ${rawData}`);

  // Process/convert the raw data into a suitable format
  const processedData = processData(rawData);

  // Publish the processed data to another topic
  client.publish('sensor/processed', processedData, (err) => {
    if (!err) {
      console.log(`Published processed data: ${processedData}`);
    } else {
      console.error('Publish error:', err);
    }
  });
});

// Function to process and convert the raw data
function processData(data) {
  // Example: If the data is JSON, parse it, modify it, and stringify it again.
  try {
    let parsed = JSON.parse(data);
    // Add or modify fields as needed
    parsed.processed = true;
    parsed.timestamp = new Date().toISOString();
    return JSON.stringify(parsed);
  } catch (error) {
    // If data isn't JSON, perform another transformation (e.g., convert to uppercase)
    return data.toUpperCase();
  }
}