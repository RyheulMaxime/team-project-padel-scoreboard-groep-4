// const lanIP = `${window.location.hostname}:5000`;
// const socket = io(`http://${lanIP}`);
var elem = document.documentElement;



// mqtt ******************************************************************************************************
var client = new Paho.MQTT.Client('192.168.10.10', 8888, 'javascript');
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
//   message = new Paho.MQTT.Message("Hello");
//   message.destinationName = "/scorebord1";
//   client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log(message.payloadString);
  var json = JSON.parse(message.payloadString);
  console.log(json);
  if (json.type == "opslag"){
    choseSide(json.side);
  }
  else if(json.type == "punten"){
    changePoints(json.rood, json.blauw)
  }
  else if(json.type == "game"){
    changeGame(json.rood, json.blauw)
  }
  else if(json.type == "set"){
    changeSet(json.rood, json.blauw)
  }
  else if(json.type == "background"){
    changeBackground(json.background)
  }
}


const choseSide = function(kleur){
    opslag_blauw = document.querySelector(".js-opslag-blue");
    opslag_rood = document.querySelector(".js-opslag-red");
    if(kleur == "blauw"){
        opslag_blauw.innerHTML = "R";
        opslag_rood.innerHTML = "";
    }else if(kleur == "rood"){
        opslag_blauw.innerHTML = "";
        opslag_rood.innerHTML = "R";
    }else{
        console.log("iets fout in choseSide")
    };
    
}

const changePoints = function( puntenRood, puntenBlauw){
  rood = document.querySelector(".js-point-red");
  blauw = document.querySelector(".js-point-blue");
  
  opslag_blauw = document.querySelector(".js-opslag-blue");
  opslag_rood = document.querySelector(".js-opslag-red");

  console.log("item binnen gekregen")
  rood.innerHTML = puntenRood;
  blauw.innerHTML = puntenBlauw;

  if(opslag_blauw.innerHTML == "R"){
      opslag_blauw.innerHTML = "";
      opslag_rood.innerHTML = "R";
  }else{
      opslag_blauw.innerHTML = "R";
      opslag_rood.innerHTML = "";
  }
}


const changeGame = function(gameRood, gameBlauw){
  game_rood = document.querySelector(".js-game-red");
  game_blauw = document.querySelector(".js-game-blue");
  console.log("item binnen gekregen")
  
  game_rood.innerHTML = gameRood;
  game_blauw.innerHTML = gameBlauw;
}

const changeSet = function(setRood, setBlauw){
  set_rood = document.querySelector(".js-set-red");
  set_blauw = document.querySelector(".js-set-blue");
  console.log("item binnen gekregen")
  set_rood.innerHTML = setRood;
  set_blauw.innerHTML = setBlauw;
}

const changeBackground = function(tekst){
  scoreboardPuntenHeader = document.querySelector(".js-punten-tekst");
  scoreboardPuntenHeader.innerHTML = tekst;
}

// socket ******************************************************************************


const listenToSocket = function(){
    
    
    
    // socket.on('B2F_tiebrake', function(){
    //     scoreboardPuntenHeader = document.querySelector(".js-punten-tekst");
    //     scoreboardPuntenHeader.innerHTML = "Tiebrake";
    // });
    
    // socket.on('B2F_punten', function(){
    //     scoreboardPuntenHeader = document.querySelector(".js-punten-tekst");
    //     scoreboardPuntenHeader.innerHTML = "Punten";
    // });

    
};

// function goFullscreen() {
//     // Must be called as a result of user interaction to work
//     mf = document.querySelector("main_frame");
//     mf.webkitRequestFullscreen();
//     mf.style.display="";
// }

// function fullscreenChanged() {
//     if (document.webkitFullscreenElement == null) {
//         mf = document.querySelector("main_frame");
//         mf.style.display="none";
//     }
// }

// document.onwebkitfullscreenchange = fullscreenChanged;
// document.documentElement.onclick = goFullscreen;
// document.onkeydown = goFullscreen;

// function openFullscreen() {
//     console.log("test fullscreen");
//     if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//     console.log("fullscreen");
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//     elem.msRequestFullscreen();
//   }
// }

// const init = function(){
//     const teamBlue = document.querySelector(".js-team-blue");
//     teamBlue.innerHTML = "Maxime"
// };

document.addEventListener('DOMContentLoaded', function() {
    // init();
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
});
