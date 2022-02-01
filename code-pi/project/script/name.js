

// var client = new Paho.MQTT.Client('127.0.0.1', 8888, 'namen');
var client = new Paho.MQTT.Client('192.168.10.10', 8888, 'namen');
var name1="",name2="",name3="",name4= "";
var tiebreak = false;
var begin_tiebreak = 0;
var count_tiebreak = 0;
var side = "team-1"; 

// set callback handlers
// client.onConnectionLost = onConnectionLost;
// client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});

function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("/scoreboard1");
    client.subscribe("/namen1");
    //   message = new Paho.MQTT.Message("Hello");
    //   message.destinationName = "/scoreboard1";
    //   client.send(message);
}
  
  // called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
}
}

const init = function(){
    const botton = document.querySelector(".js-button");
    console.log(rood1)
    botton.addEventListener("click",function(){
    //   console.log("clicked")
        var rood1 = document.querySelector(".js-naam1").value;
        var rood2 = document.querySelector(".js-naam2").value;
        var blauw1 = document.querySelector(".js-naam3").value;
        var blauw2 = document.querySelector(".js-naam4").value;
        console.log("Make json")
        var jsonBlauw = JSON.stringify({"type" : "name", "side" : "blauw", "name1": `${blauw1}`, "name2": `${blauw2}`})
        var jsonRood = JSON.stringify({"type" : "name", "side" : "rood", "name1": `${rood1}`, "name2": `${rood2}`})
        console.log("we zijn al zover gegraakt")
        // aedes.publish({ topic: '/namen1', payload: `${jsonBlauw}` + "namen" })
        
        message = new Paho.MQTT.Message(`${jsonRood}`);
        message.destinationName = "/namen1";
        client.send(message);
        
        message2 = new Paho.MQTT.Message(`${jsonBlauw}`);
        message2.destinationName = "/namen1";
        client.send(message2);

        console.log("published")
    })
  }
  
  document.addEventListener('DOMContentLoaded', function() {
      // init();
      client.onConnectionLost = onConnectionLost;
    //   client.onMessageArrived = onMessageArrived;
      init();
  });