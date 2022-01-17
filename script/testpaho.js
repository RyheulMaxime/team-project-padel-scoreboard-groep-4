// const mqtt = require('mqtt')
// const client = mqtt.connect('192.168.10.10')
// client.on('connect', () => {
//   console.log("it is alive")
// })

// console.log(location.hostname)
// Create a client instance
var client = new Paho.MQTT.Client('172.30.248.57', 1883 ,'javascript');
// var client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("/scorebord1");
  message = new Paho.MQTT.Message("Hello");
  message.destinationName = "/scorebord1";
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}