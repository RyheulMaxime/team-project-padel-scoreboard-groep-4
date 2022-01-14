const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);
var elem = document.documentElement;



const listenToUI = function(){
    socket.on('connect', function(){
        console.log(`verbonden met socket webserver`);
    });
};

const listenToSocket = function(){
    
};

function goFullscreen() {
    // Must be called as a result of user interaction to work
    mf = document.querySelector("main_frame");
    mf.webkitRequestFullscreen();
    mf.style.display="";
}

// function fullscreenChanged() {
//     if (document.webkitFullscreenElement == null) {
//         mf = document.querySelector("main_frame");
//         mf.style.display="none";
//     }
// }

// document.onwebkitfullscreenchange = fullscreenChanged;
// document.documentElement.onclick = goFullscreen;
// document.onkeydown = goFullscreen;

function openFullscreen() {
    console.log("test fullscreen");
    if (elem.requestFullscreen) {
    elem.requestFullscreen();
    console.log("fullscreen");
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

// const init = function(){
//     const teamBlue = document.querySelector(".js-team-blue");
//     teamBlue.innerHTML = "Maxime"
// };

document.addEventListener('DOMContentLoaded', function() {
    // init();
    listenToUI();
    listenToSocket();
    openFullscreen();

});
