
// var elem = document.documentElement;


// mqtt ******************************************************************************************************
// mqtt broker py
// var client = new Paho.MQTT.Client('192.168.10.10', 8888, 'javascript');
// test mqtt broker
var client = new Paho.MQTT.Client('127.0.0.1', 8888, 'javascript');
var name1="",name2="",name3="",name4= "";
var tiebreak = false;
var begin_tiebreak = 0;
var side = "team-1"; 
var vorige = "team1";

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
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

// called when a message arrives
function onMessageArrived(message) {
  // console.log(message.payloadString);
  var json = JSON.parse(message.payloadString);
  console.log(json);
  if (json.type == "opslag"){
    choseSide(json.side);
  }
  else if(json.type == "punten"){
    changePoints(json.rood, json.blauw,json.minpunt)
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
  else if(json.type == "gedaan"){
    endGame(json.side)
  }
  else if(json.type == "nieuw"){
    nieuwGame()
  }
  else if(json.type == "name"){
    // console.log(json.side, json.name1 , json.name2)
    changeName(json.side, json.name1 , json.name2)
  }
}

const choseSide = function(kleur){
    opslag_blauw = document.querySelector(".js-opslag");
    // opslag_rood = document.querySelector(".js-opslag-red");

    if(kleur == "blauw"){
      opslag_blauw.classList.add("is-team-2")
      opslag_blauw.classList.remove("is-left")
      side = "team-2"
    }else if(kleur == "rood"){
      opslag_blauw.classList.remove("is-team-2")
      opslag_blauw.classList.remove("is-left")
      side = "team-1"
    }
    // else{
    //   opslag_blauw.innerHTML = "";
    //   opslag_rood.innerHTML = "";
    // };
}

const changePoints = function( puntenRood, puntenBlauw, minpunt ){
  // console.log(minpunt)
  rood = document.querySelector(".js-point-red");
  blauw = document.querySelector(".js-point-blue");
  spel = document.querySelector(".js-opslag");

  if(spel.classList.contains("is-done")){

  }
  else {
    if (minpunt == "true"){
      rood.innerHTML = puntenRood;
      blauw.innerHTML = puntenBlauw;

      if(tiebreak == true){
        console.log(begin_tiebreak)
        // if(begin_tiebreak == 1){
        //   if(vorige == "team1"){
        //     spel.classList.remove("is-team-2")
        //     spel.classList.remove("is-left")
        //   } else{
        //     spel.classList.add("is-team-2")
        //     spel.classList.remove("is-left")
        //   }
        // }
        if(begin_tiebreak == 2){
          begin_tiebreak = 1
          if(opslag.classList.contains("is-team-2")){
            opslag.classList.remove("is-team-2")
          }else{
            opslag.classList.add("is-team-2")
          }
          spel.classList.remove("is-left")
        }else if(begin_tiebreak == 3){
          begin_tiebreak = 2
          spel.classList.add("is-left")
        }else if(begin_tiebreak == 4){
          begin_tiebreak = 3
          if(opslag.classList.contains("is-team-2")){
            opslag.classList.remove("is-team-2")
          }else{
            opslag.classList.add("is-team-2")
          }
          spel.classList.remove("is-left")
        }else if(begin_tiebreak > 4){
          begin_tiebreak -= 1
          // console.log(begin_tiebreak)
          console.log(begin_tiebreak %2)
          if(begin_tiebreak%2 == 1){
            if(opslag.classList.contains("is-team-2")){
              opslag.classList.remove("is-team-2")
            }else{
              opslag.classList.add("is-team-2")
            }
            spel.classList.add("is-left")
          }else if(begin_tiebreak %2 == 0){
          }
        }
      }else{
          if(spel.classList.contains("is-left")){
            spel.classList.remove("is-left")
          }else{
            spel.classList.add("is-left")
          } 
      }
    }else{
      rood.innerHTML = puntenRood;
      blauw.innerHTML = puntenBlauw;

      if(tiebreak == true){
        if(begin_tiebreak == 0){
          begin_tiebreak = 1
          if(spel.classList.contains("is-team-2")){
            vorige = "team2";
          }else{
            vorige = "team1";
          }
          if(side == "team-1"){
            spel.classList.remove("is-team-2")
            spel.classList.remove("is-left")
          } else{
            spel.classList.add("is-team-2")
            spel.classList.remove("is-left")
          }
        }
        else if(begin_tiebreak == 1){
          begin_tiebreak = 2
          if(opslag.classList.contains("is-team-2")){
            opslag.classList.remove("is-team-2")
          }else{
            opslag.classList.add("is-team-2")
          }
          spel.classList.add("is-left")
        }else if(begin_tiebreak == 2){
          begin_tiebreak = 3
          spel.classList.remove("is-left")
        }else if(begin_tiebreak >= 3){
          begin_tiebreak += 1
          // console.log(begin_tiebreak)
          console.log(begin_tiebreak %2)
          if(begin_tiebreak%2 == 0){
            if(opslag.classList.contains("is-team-2")){
              opslag.classList.remove("is-team-2")
            }else{
              opslag.classList.add("is-team-2")
            }
            spel.classList.add("is-left")
          }else if(begin_tiebreak %2 == 1){
          }
        }
      }else{
          if(spel.classList.contains("is-left")){
            spel.classList.remove("is-left")
          }else{
            spel.classList.add("is-left")
          } 
      }
    }  
  }

}

const changeGame = function(gameRood, gameBlauw){
  game_rood = document.querySelector(".js-game-red");
  game_blauw = document.querySelector(".js-game-blue");
  opslag = document.querySelector(".js-opslag");
  console.log("item binnen gekregen")
  
  game_rood.innerHTML = gameRood;
  game_blauw.innerHTML = gameBlauw;

  if(opslag.classList.contains("is-team-2")){
    opslag.classList.remove("is-team-2")
    opslag.classList.add("is-left")
  }else{
    opslag.classList.add("is-team-2")
    opslag.classList.add("is-left")
  }
}

const changeSet = function(setRood, setBlauw){
  set_rood = document.querySelector(".js-set-red");
  set_blauw = document.querySelector(".js-set-blue");
  opslag = document.querySelector(".js-opslag");
  console.log("item binnen gekregen")
  // opslag.classList.remove("is-left")
  set_rood.innerHTML = setRood;
  set_blauw.innerHTML = setBlauw;
}

const endGame = function(winaar){
  winner = document.querySelector(".js-winner")
  gedaan = document.querySelector(".js-opslag");
  message = ""
  if (winaar == "rood"){
    if(name1 != ""){
      if(name2 != ""){
        message +=  `${name1} en `;
      }
      else{
        message +=  `${name1}`;
      }
    }
    if(name2 != ""){
      message +=  `${name2}`;
    }
    if(name1 != "" ^ name2 != ""){
      message += ` is de winnaars`
    }
    if(name1 != "" && name2 != ""){
      message += ` zijn de winnaars`
    }
    else if(name1 == "" && name2 == ""){
      message += `Team 1 zijn de winnaars`
    }
  }
  if (winaar == "blauw"){
    if(name3 != ""){
      if(name4 != ""){
        message +=  `${name3} en `;
      }
      else{
        message +=  `${name3}`;
      }
    }
    if(name4 != ""){
      message +=  `${name4}`;
    }
    if(name3 != "" || name4 != ""){
      message += ` is de winnaars`
    }
    if(name3 != "" && name4 != ""){
      message += ` zijn de winnaars`
    }
    else if(name2 == "" && name4 == ""){
      message += `Team 1 zijn de winnaars`
    }
  }
  winner.innerHTML = message
  gedaan.classList.add("is-done")
}

const nieuwGame = function(){
  winner = document.querySelector(".js-winner")
  gedaan = document.querySelector(".js-opslag");
  gedaan.classList.remove("is-done")
  gedaan.classList.add("is-left")
}

const changeBackground = function(tekst){
  type = document.querySelector(".js-opslag");
  if(tekst == "Tiebrake"){
    type.classList.add("tiebreak")
    tiebreak = true
  }else{
    type.classList.remove("tiebreak")
    tiebreak = false
    begin_tiebreak = 0
  }
  
}

const changeName = function(kleur,naam1,naam2){
  teamRood = document.querySelector(".js-team-red")
  teamBlauw = document.querySelector(".js-team-blue")
  var namenRood = ""
  var namenBlauw = ""
  if (kleur == "rood"){
    if(naam1 != ""){
      if(naam2 != ""){
        namenRood +=  `<p class="c-scoreboard-naam">${naam1},</p>`;
        name1 = naam1
        name2 = ""
      }
      else{
        namenRood +=  `<p class="c-scoreboard-naam">${naam1}</p>`;
        name1 = naam1
      }
    }
    if(naam2 != ""){
      namenRood +=  `<p class="c-scoreboard-naam">${naam2}</p>`;
      name2 = naam2
      if(naam1 == ""){
        name1 = ""
      }
    }
    if(naam1 == "" && naam2 == ""){
      namenRood = `<p class="c-scoreboard-naam">Team Rood</p>`
      name1 = ""
      name2 = ""
    }
    teamRood.innerHTML = namenRood;
  }else if(kleur == "blauw"){
    if(naam1 != ""){
      if(naam2 != ""){
        namenBlauw +=  `<p class="c-scoreboard-naam">${naam1},</p>`;
        name3 = naam1
      }
      else{
        namenBlauw +=  `<p class="c-scoreboard-naam">${naam1}</p>`;
        name3 = naam1
        name4 = ""
      }
    }
    if(naam2 != ""){
      namenBlauw +=  `<p class="c-scoreboard-naam">${naam2}</p>`;
      name4 = naam2
      if(naam1 == ""){
        name3 = ""
      }
    }
    if(naam1 == "" && naam2 == ""){
      namenBlauw = `<p class="c-scoreboard-naam">Team Blauw</p>`
      name3 = ""
      name4 = ""
    }
    teamBlauw.innerHTML = namenBlauw;
  }
}

// const init = function(){
//   const botton = document.querySelector(".js-button");
//   const rood1 = document.querySelector(".js-naam1");
//   const rood2 = document.querySelector(".js-naam2");
//   const blauw1 = document.querySelector(".js-naam3");
//   const blauw2 = document.querySelector(".js-naam4");
//   botton.addEventListener("click",function(){
//     console.log("clicked")
//   })
// }

document.addEventListener('DOMContentLoaded', function() {
    // init();
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    // init();
});
