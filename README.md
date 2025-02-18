Below is a sample README.md file for your MQTT server project using Docker Compose:

# mqqt-server

This repository provides a Docker-based setup to run an MQTT broker (using Eclipse Mosquitto) and a Node.js server. The Node.js service acts as an MQTT client that can both subscribe to topics and publish messages.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) installed

## File Structure

mqqt-server/
├── docker-compose.yml   # Defines both Mosquitto and Node.js services
├── mosquitto.conf       # Custom configuration file for Mosquitto
├── server.js            # Node.js server file containing your MQTT client logic
└── README.md            # This file

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://your-repository-url.git
   cd mqqt-server

	2.	Configure Mosquitto (Optional):
The provided mosquitto.conf configures Mosquitto to listen on port 1883 and allow anonymous access. You can modify it as needed:

listener 1883
allow_anonymous true


	3.	Build and Run the Containers:
Run the following command in the repository directory:

docker-compose up --build

This command will:
	•	Start the Mosquitto broker container and expose port 1883.
	•	Start the Node.js container, which will run server.js after a short delay.
	•	Automatically restart containers if they stop unexpectedly (using the restart policy).

Docker Compose Configuration

Below is an overview of the services defined in docker-compose.yml:
	•	Mosquitto Broker:
	•	Uses the official Eclipse Mosquitto image.
	•	Exposes port 1883 to the host.
	•	Mounts mosquitto.conf from the current directory for custom configurations.
	•	Has a restart policy set to always.
	•	Node.js Server:
	•	Uses the official Node.js (alpine) image.
	•	Sets /app as the working directory and mounts the current directory.
	•	Delays startup for 10 seconds (sleep 10) to ensure the broker is available.
	•	Depends on the Mosquitto service.
	•	Optionally exposes port 3000 if your Node.js application serves HTTP traffic.
	•	Also uses a restart policy.

Example snippet from docker-compose.yml:

version: '3.8'

services:
  mosquitto:
    image: eclipse-mosquitto:latest
    container_name: mosquitto
    ports:
      - "1883:1883"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
    restart: always

  node-server:
    image: node:16-alpine
    container_name: node-server
    working_dir: /app
    volumes:
      - .:/app
    command: sh -c "sleep 10 && node server.js"
    depends_on:
      - mosquitto
    ports:
      - "3000:3000"
    restart: always

Node.js Server (server.js)

Ensure your server.js file connects to the Mosquitto broker using the service name mosquitto. For example:

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mosquitto:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to a topic
  client.subscribe('sensor/data', (err) => {
    if (!err) {
      console.log('Subscribed to sensor/data');
    }
  });

  // Publish a message to a topic (example)
  client.publish('sensor/processed', 'Hello from Node.js!');
});

client.on('message', (topic, message) => {
  console.log(`Received message on ${topic}: ${message.toString()}`);
});

Troubleshooting
	•	Connection Issues:
	•	Make sure both containers are running: docker-compose ps
	•	Check the logs for each service:

docker-compose logs mosquitto
docker-compose logs node-server


	•	Verify that your Node.js code connects to the broker at mqtt://mosquitto:1883.

	•	Restart Policy:
	•	Both containers have restart: always set, ensuring they restart if they crash.

Stopping the Containers

To stop and remove the containers, run:

docker-compose down

Further Reading
	•	Eclipse Mosquitto Documentation
	•	Docker Compose Documentation

Happy coding!