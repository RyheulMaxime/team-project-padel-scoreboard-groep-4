'use strict';

let token = '';
const lanIP = `https://baptistevandereecken.azurewebsites.net/api/`;
// const clientId = `a8f25766-4981-4af3-b4d2-e33e7726fe43`

// var clubId = "a8f25766-4981-4af3-b4d2-e33e7726fe43"
var clubId = ""

const get = (url) => fetch(url).then((r) => r.json());

const showInfoSponsor = async function(sponsornummer,sponsorId){
    // console.log(sponsorId)
    var annulatie = document.querySelector(`.js-annuleren-${sponsornummer}`);
    var toepassen = document.querySelector(`.js-toepassen-${sponsornummer}`);
    var voorbeeld = document.querySelector(`.js-voorbeeld-${sponsornummer}`)
    var voorbeeldLink = document.querySelector(`.js-voorbeeld-link-${sponsornummer}`)
    var voorbeeldNaam = document.querySelector(`.js-voorbeeld-naam-${sponsornummer}`)
    
    // if(sponsorId != ""){
    //     // console.log("true")
    //      var endPoint = `https://baptistevandereecken.azurewebsites.net/api/sponsor/${sponsorId}`
    //     // handleData(endPoint,showSponsor)
    // }else{
    //     console.log("false")
    // }
    annulatie.addEventListener("click",function(){
        var sponsor = document.querySelector(`.js-sponsor-${sponsornummer}`);
        if(sponsorId != ""){
            var logo = document.querySelector(`.js-logo-${sponsornummer}`).src;
            var naam = document.querySelector(`.js-naam-${sponsornummer}`).innerHTML;
            voorbeeldLink.value = logo
            voorbeeldNaam.value = naam

            voorbeeld.innerHTML = `<img class="c-logo" src="${logo}" alt="voorbeeld ${naam}">`
        }else{
            voorbeeldLink.value = ""
            voorbeeldNaam.value = ""
            voorbeeld.innerHTML = `<img class="c-logo" src="" alt="voorbeeld">`
        }
        sponsor.classList.remove("is-active") 
    })
    
    voorbeeldLink.addEventListener("change",function(){
        var link = voorbeeldLink.value
        voorbeeld.innerHTML = `<img class="c-logo" src="${link}" alt="voorbeeld ${voorbeeldNaam.value}">`
    })

    toepassen.addEventListener("click",function(){
        var sponsor = document.querySelector(`.js-sponsor-${sponsornummer}`);
        if(sponsorId != ""){
            var endPoint = `https://baptistevandereecken.azurewebsites.net/api/sponsor/${sponsorId}`
            var body =  JSON.stringify({"naam":voorbeeldNaam.value,"foto":voorbeeldLink.value})
            console.log(body)
            fetch(endPoint, {
                method: "PUT",
                body: body,
                headers: {
                  'content-type': 'application/json',
                },
            })
            getAPI()
            // handleData(endPoint,null,null,"PUT",body)
        }else{
            var endPoint = `https://baptistevandereecken.azurewebsites.net/api/sponsors`
            var body =  JSON.stringify({"naam":voorbeeldNaam.value,"foto":voorbeeldLink.value,"clubid": clubId})
            console.log(body)
            fetch(endPoint, {
                method: "POST",
                body: body,
                headers: {
                  'content-type': 'application/json',
                },
            })
            getAPI()
        }
    })


} 

const showInfoEigenaar = function(){
    var annulatie = document.querySelector(`.js-annuleren-eigenaar`);
    var voorbeeld = document.querySelector(`.js-voorbeeld-eigenaar`)
    var voorbeeldLink = document.querySelector(`.js-voorbeeld-link-eigenaar`)
    var voorbeeldNaam = document.querySelector(`.js-voorbeeld-naam-eigenaar`)
    var voorbeeldEmail = document.querySelector(`.js-voorbeeld-email-eigenaar`)
    var toepassen = document.querySelector(".js-toepassen");

    annulatie.addEventListener("click",function(){
        var logo = document.querySelector(`.js-logo-eigenaar`).src;
        // console.log(logo)
        var naam = document.querySelector(`.js-eigenaar-naam`).innerHTML;
        // console.log(naam)
        voorbeeldLink.value = logo
        voorbeeldNaam.value = naam

        voorbeeld.innerHTML = `<img class="c-logo" src="${logo}" alt="voorbeeld ${naam}">`
        var eigenaar = document.querySelector(".js-eigenaar");
        eigenaar.classList.remove("is-overvieuw") 
    })

    voorbeeldLink.addEventListener("change",function(){
        var link = voorbeeldLink.value
        voorbeeld.innerHTML = `<img class="c-logo" src="${link}" alt="voorbeeld ${voorbeeldNaam.value}">`
    })

    toepassen.addEventListener("click",function(){
        var eigenaar = document.querySelector(`.js-eigenaar`);
        var endPoint = `https://baptistevandereecken.azurewebsites.net/api/club/${clubId}`
        var body =  JSON.stringify({"naam":voorbeeldNaam.value,"logo":voorbeeldLink.value,"email":voorbeeldEmail.value})
        console.log(body)
        fetch(endPoint, {
            method: "PUT",
            body: body,
            headers: {
                'content-type': 'application/json',
            },
        })
        getAPI()
        eigenaar.classList.remove("is-overvieuw")
    })

}

const showEigenaar = function(jsonObject){
    // console.log(jsonObject)
    if(jsonObject.id == "00000000-0000-0000-0000-000000000000"){
        isFout()
    }else{
        const eigenaar = document.querySelector(".js-eigenaar");
        var infoEigenaar = `<div class="c-eigenaar-overvieuw">
                <div class="c-eigenaar-overvieuw-logo">
                    <img class="c-logo js-logo-eigenaar" src="${jsonObject.logo}" alt="logo ${jsonObject.naam}">
                </div>
                <p class="c-eigenaar-overvieuw-naam js-eigenaar-naam">${jsonObject.naam}</p>
                <div class="c-eigenaar-overvieuw-aanpassen">
                    <button class="c-eigenaar-overvieuw-aanpassen-button js-update-eigenaar">
                        AANPASSEN
                    </button>
                </div>
            </div>
            <form class="c-eigenaar-info">
                <label class="c-eigenaar-info-naam" for="naam">Naam:</label>
                <input class="c-eigenaar-info-naam__input js-voorbeeld-naam-eigenaar" type="text" id="naam" name="naam" value="${jsonObject.naam}" placeholder="Geef naam club" autocomplete="off">
                <label class="c-eigenaar-info-email" for="email">Email:</label>
                <input class="c-eigenaar-info-email__input js-voorbeeld-email-eigenaar" type="email" id="email" name="email" value="${jsonObject.email}" placeholder="Geef email address club" autocomplete="off">
                <label class="c-eigenaar-info-link" for="link">Link Logo:</label>
                <input class="c-eigenaar-info-link__input js-voorbeeld-link-eigenaar" type="text" id="link" name="link" value="${jsonObject.logo}" placeholder="Geef link naar logo club" autocomplete="off">
                <p class="c-eigenaar-info-voorbeeld">Voorbeeld:</p>
                <div class="c-eigenaar-info-voorbeeld__logo js-voorbeeld-eigenaar">
                    <img class="c-logo" src="${jsonObject.logo}" alt="Voorbeeld logo ${jsonObject.naam}">
                </div>
                <button class="c-eigenaar-info-annuleren js-annuleren-eigenaar" type="button">
                    ANNULEREN
                </button>
                <button class="c-eigenaar-info-toepassen js-toepassen" type="button">
                    TOEPASSEN
                </button>
            </form> `
        console.log(jsonObject)
        // var aantalSponsoren = 0
        
        eigenaar.innerHTML = infoEigenaar
        aanpassenEigenaar()
    }
    
}

const aanpassenEigenaar = function(){
    var updateEigenaar = document.querySelector(".js-update-eigenaar");

    updateEigenaar.addEventListener("click",function(){
        const eigenaar = document.querySelector(".js-eigenaar");
        eigenaar.classList.add("is-overvieuw")
        showInfoEigenaar() 
    })


}

const showSponsoren = function(jsonObject){
    
    const sponsoren = document.querySelector(".js-sponsoren");
    var eigenSposoren = ``
    console.log(jsonObject)
    var aantalSponsoren = 0
    while(aantalSponsoren < 4){
        // console.log(jsonObject[aantalSponsoren])
        var sponsor = jsonObject[aantalSponsoren]
        if(sponsor != undefined){
            eigenSposoren += `<div class="c-sponsor c-sponsor-sposor${aantalSponsoren+1} js-sponsor-${aantalSponsoren+1}" id="${sponsor.id}">
            <div class="c-sponsor-overvieuw">
                <p class="c-sponsor-overvieuw-naam js-naam-${aantalSponsoren+1}">${sponsor.naam}</p>
                <div class="c-sponsor-overvieuw-logo">
                    <img class="c-logo js-logo-${aantalSponsoren+1}" src="${sponsor.foto}" alt="adidas">
                </div>
                <div class="c-sponsor-overvieuw-update">
                    <button class="c-sponsor-overvieuw-update__button js-update-${aantalSponsoren+1}">
                    <div class="c-button">AANPASSEN</div>
                    </button>
                </div>
                <div class="c-sponsor-overvieuw-delete">
                    <button class="c-sponsor-overvieuw-delete__button js-delete-${aantalSponsoren+1}">
                        VERWIJDEREN
                    </button>
                </div>
            </div>
            <form class="c-sponsor-info">
                <label class="c-sponsor-info-naam" for="naam${aantalSponsoren+1}">Naam:</label>
                <input class="c-sponsor-info-naam__input js-voorbeeld-naam-${aantalSponsoren+1}" type="text" id="naam${aantalSponsoren+1}" name="naam${aantalSponsoren+1}" value="${sponsor.naam}" placeholder="Geef naam sponsor">
                <label class="c-sponsor-info-link" for="link${aantalSponsoren+1}">Link Foto:</label>
                <input class="c-sponsor-info-link__input js-voorbeeld-link-${aantalSponsoren+1}" type="text" id="link${aantalSponsoren+1}" name="link${aantalSponsoren+1}" value="${sponsor.foto}" placeholder="Geef URL link sponsor">
                <p class="c-sponsor-info-voorbeeld">Voorbeeld:</p>
                <div class="c-sponsor-info-voorbeeld__logo js-voorbeeld-${aantalSponsoren+1}">
                    <img class="c-logo" src="${sponsor.foto}" alt="voorbeeld adidas">
                </div>
                <button class="c-sponsor-info-annuleren js-annuleren-${aantalSponsoren+1}" type="button">
                    ANNULEREN
                </button>
                <button class="c-sponsor-info-toepassen js-toepassen-${aantalSponsoren+1}" type="button">
                    TOEPASSEN
                </button>
            </form>
        </div>`
        }else{
            eigenSposoren += `<div class="c-sponsor c-sponsor-sposor${aantalSponsoren+1} js-sponsor-${aantalSponsoren+1} isNeuw="true">    
            <div class="sponsor-overvieuw-toevoegen">
                <p class="c-sponsor-overvieuw-toevoegen-text">Nieuwe Sponsor toevoegen</p>
                <button class="c-sponsor-overvieuw-toevoegen-button js-update-${aantalSponsoren+1}">
                    TOEVOEGEN
                </button>
            </div>
            <form class="c-sponsor-info">
                <label class="c-sponsor-info-naam" for="naam1">Naam:</label>
                <input class="c-sponsor-info-naam__input js-voorbeeld-naam-${aantalSponsoren+1}" type="text" id="naam1" name="naam1" placeholder="Geef naam sponsor">
                <label class="c-sponsor-info-link" for="link1">Link Foto:</label>
                <input class="c-sponsor-info-link__input js-voorbeeld-link-${aantalSponsoren+1}" type="text" id="link1" name="link1" placeholder="Geef URL link sponsor">
                <p class="c-sponsor-info-voorbeeld">Voorbeeld:</p>
                <div class="c-sponsor-info-voorbeeld__logo js-voorbeeld-${aantalSponsoren+1}">
                    <img class="c-logo" src="" alt="voorbeeld" width="80%">
                </div>
                <button class="c-sponsor-info-annuleren js-annuleren-${aantalSponsoren+1}" type="button">
                    ANNULEREN
                </button>
                <button class="c-sponsor-info-toepassen js-toepassen-${aantalSponsoren+1}" type="button">
                    TOEPASSEN
                </button>
            </form>
        </div>`
        }
        aantalSponsoren += 1
    }
    sponsoren.innerHTML = eigenSposoren
    aanpassenSponsoren();
}

let getAPI = async () => {
	const endPoint = `https://baptistevandereecken.azurewebsites.net/api/sponsors/${clubId}`
	const endPoint2 = `https://baptistevandereecken.azurewebsites.net/api/club/${clubId}`
    
    handleData(endPoint2, showEigenaar,isFout);
	handleData(endPoint, showSponsoren,isFout);
	
};

const isFout = function(){
    var html = document.querySelector(".js-doc")
    var login = document.querySelector(".js-login")
    html.classList.remove("is-done")
    html.classList.add("melding")

}

const aanpassenSponsoren = function(){
    var update1 = document.querySelector(".js-update-1");
    var update2 = document.querySelector(".js-update-2");
    var update3 = document.querySelector(".js-update-3");
    var update4 = document.querySelector(".js-update-4");
    var verwijderen1 = document.querySelector(`.js-delete-1`)
    var verwijderen2 = document.querySelector(`.js-delete-2`)
    var verwijderen3 = document.querySelector(`.js-delete-3`)
    var verwijderen4 = document.querySelector(`.js-delete-4`)
    

    update1.addEventListener("click",function(){
        const sponsor1 = document.querySelector(".js-sponsor-1");
        // console.log(sponsor1.id)
        sponsor1.classList.add("is-active") 
        showInfoSponsor("1",sponsor1.id)
    })
    update2.addEventListener("click",function(){
        // console.log("update2")
        const sponsor2 = document.querySelector(".js-sponsor-2");
        sponsor2.classList.add("is-active") 
        showInfoSponsor("2",sponsor2.id)
    })
    update3.addEventListener("click",function(){
        const sponsor3 = document.querySelector(".js-sponsor-3");
        sponsor3.classList.add("is-active")
        showInfoSponsor("3",sponsor3.id)     
    })
    update4.addEventListener("click",function(){
        const sponsor4 = document.querySelector(".js-sponsor-4");
        sponsor4.classList.add("is-active")
        showInfoSponsor("4",sponsor4.id) 
    })
    verwijderen1.addEventListener("click",function(){
        const sponsor1 = document.querySelector(".js-sponsor-1");
        // console.log(sponsor1.id)
        var endPoint = `https://baptistevandereecken.azurewebsites.net/api/sponsor/${sponsor1.id}/${clubId}`
        handleData(endPoint,getAPI,null,"DELETE")
    })
    verwijderen2.addEventListener("click",function(){
        // console.log("update2")
        const sponsor2 = document.querySelector(".js-sponsor-2");
        var endPoint = `https://baptistevandereecken.azurewebsites.net/api/sponsor/${sponsor2.id}/${clubId}`
        handleData(endPoint,getAPI,null,"DELETE")
    })
    verwijderen3.addEventListener("click",function(){
        const sponsor3 = document.querySelector(".js-sponsor-3"); 
        var endPoint = `https://baptistevandereecken.azurewebsites.net/api/sponsor/${sponsor3.id}/${clubId}`
        handleData(endPoint,getAPI,null,"DELETE")
    })
    verwijderen4.addEventListener("click",function(){
        const sponsor4 = document.querySelector(".js-sponsor-4");
        var endPoint = `https://baptistevandereecken.azurewebsites.net/api/sponsor/${sponsor4.id}/${clubId}`
        handleData(endPoint,getAPI,null,"DELETE")
    })
};

const init = function(){
    var html = document.querySelector(".js-doc")
    var login = document.querySelector(".js-login-button");
    login.addEventListener("click",function(){
        var id = document.querySelector(".js-input-login")
        clubId = id.value  

        html.classList.add("is-done")
        getAPI();
    })

    
}

document.addEventListener('DOMContentLoaded', function() {
    init();
    
    // init();
});