const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);
var elem = document.documentElement;



const listenToUI = function(){
   
};

const listenToSocket = function(){
    socket.on('connect', function(){
        console.log(`verbonden met socket webserver`);
        // document.querySelector(".js-button").click();
        // window.scrollTo(0,1);
    });

    socket.on('B2F_verandering_punten', function(jsonObject){
        // console.log(`verbonden met socket webserver`);
        rood = document.querySelector(".js-point-red");
        blauw = document.querySelector(".js-point-blue");
        
        opslag_blauw = document.querySelector(".js-opslag-blue");
        opslag_rood = document.querySelector(".js-opslag-red");

        console.log("item binnen gekregen")
        console.log(jsonObject);
        rood.innerHTML = jsonObject.red;
        blauw.innerHTML = jsonObject.blue;

        if(opslag_blauw.innerHTML == "R"){
            opslag_blauw.innerHTML = "";
            opslag_rood.innerHTML = "R";
        }else{
            opslag_blauw.innerHTML = "R";
            opslag_rood.innerHTML = "";
        }
    });
    
    socket.on('B2F_verandering_game', function(jsonObject){
        // console.log(`verbonden met socket webserver`);
        game_rood = document.querySelector(".js-game-red");
        game_blauw = document.querySelector(".js-game-blue");
        console.log("item binnen gekregen")
        console.log(jsonObject);
        game_rood.innerHTML = jsonObject.red;
        game_blauw.innerHTML = jsonObject.blue;
    });
    
    socket.on('B2F_verandering_set', function(jsonObject){
        // console.log(`verbonden met socket webserver`);
        set_rood = document.querySelector(".js-set-red");
        set_blauw = document.querySelector(".js-set-blue");
        console.log("item binnen gekregen")
        console.log(jsonObject);
        set_rood.innerHTML = jsonObject.red;
        set_blauw.innerHTML = jsonObject.blue;
    });
    
    socket.on('B2F_tiebrake', function(){
        scoreboardPuntenHeader = document.querySelector(".js-punten-tekst");
        scoreboardPuntenHeader.innerHTML = "Tiebrake";
    });
    
    socket.on('B2F_punten', function(){
        scoreboardPuntenHeader = document.querySelector(".js-punten-tekst");
        scoreboardPuntenHeader.innerHTML = "Punten";
    });

    
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
    listenToUI();
    listenToSocket();

});
