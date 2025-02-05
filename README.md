# Ukulele IoT Server

This server acts as a bridge between the ESP32 IoT devices and the mobile application. It receives sensor data, processes it, and sends control commands via **MQTT** to the ukulele's actuators.

## 🚀 Features
- **MQTT Broker Integration**: Handles communication between ESP32 devices.
- **REST API & WebSockets**: Allows the mobile app to manage recordings and playback.
- **Database Support**: Stores recorded user inputs for replay.
- **Node.js with TypeScript**: Ensures type safety and maintainability.

---

## 🛠 Setup and Installation

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/IOT-group8/ukulele-iot-server.git
cd ukulele-iot-server
