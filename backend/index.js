require("dotenv").config();
const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const cors=require("cors")
const { Server } = require("socket.io");
const os=require("os");
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
let host=getLocalIP();
const server = http.createServer(app,{});
const io = new Server(server,{
  cors:{
    origin:
    `http://localhost:5173`,
    methods:["GET","POST"],
    credentials:true
  },allowEIO3:true
});
const broker = process.env.MQTT_TLS;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
const topic=process.env.MQTT_TOPIC

const options = {
  username,
  password,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
};

console.log("Connecting to broker:", broker);
const mqttclient = mqtt.connect(broker,{...options,rejectUnauthorized:false,clean:true,connectTimeout:4000});
mqttclient.on("error", (err) => {
  console.error("MQTT connection error:", err.message);
  mqttclient.end();
});
mqttclient.on("connect", (err) => {

  console.log("MQTT Connected");
  mqttclient.subscribe(topic,(err)=>{
    if(err){
    console.error("Failed to subscribe",err);
    }
    else{
      console.log("Successfully subscribed to topic",topic);
    }
  
  })
});
mqttclient.on("message",(topic,payload)=>{
  const message=payload.toString();
  console.log(`MQTT ${topic} => ${message}`);
  io.emit("mqtt_message",{topic,message:message});

})
io.on("connection", (socket) => {
  console.log("WebSocket client connected:", socket.id);
});
server.listen(port,"0.0.0.0",() => {
  console.log(`SErver running at host ${host} and port ${port}`);
});
process.on('SIGINT', () => {
  console.log('Gracefully shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
