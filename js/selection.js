"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase } from './viMethods.js';

const firebaseApp = initializeApp
({
    apiKey: "AIzaSyArcsmJkXSeuIHMysYtIzRdjIDlKNQA25Y",
    authDomain: "forgottenrealmsmap.firebaseapp.com",
    projectId: "forgottenrealmsmap",
    storageBucket: "forgottenrealmsmap.appspot.com",
    messagingSenderId: "697902154695",
    appId: "1:697902154695:web:ffa5c47817f3097c89cfe2",
    measurementId: "G-Q2W494NRDT"
});

let database = getDatabase();
let auth = getAuth();
let player;
let wholeChars = {};
let enter = document.getElementById("enter");
let charName = document.getElementById("name");
let currentName;
let div = document.getElementById("story");
let borders = ["blue", "golden", "green", "grey", "orange", "pink", "purple", "red"];
let char = document.createElement("h3");
let bord = document.createElement("h3");
let hp = document.createElement("h3");
let go = document.createElement("button");
let people = [];
let numToLet = {0 : "", 1 : "a", 2 : "b"};
let firstRun = true;
let oldToken = {};

const charRef = ref(database, 'playerChar/');
onValue(charRef, (snapshot) => 
{
    const data = snapshot.val();
    if(firstRun)
    {
        firstRun = false;
        wholeChars = data;
        userLoggedIn();
    }
});

onAuthStateChanged(auth, (user) => 
{
    if (!user) 
    {
        alert("You need to login before using this resource. Click Ok and be redirected");
        window.location.href = "loginPage.html?selection.html"; 
    } 
});

function userLoggedIn()
{
    player = auth.currentUser.email;
    player = player.split("@");
    player = toTitleCase(player[0]);
    oldToken = wholeChars[player]["token"];
    init();
    charName.value = wholeChars[player]["charName"];
    handleEnterButton();
}

function init()
{
    char.innerHTML = "Select Character";
    char.classList = "blo";
    char.style.margin = "5px";
    bord.innerHTML = "Select Boarder";
    bord.classList = "blo";
    bord.style.margin = "5px";
    go.innerHTML = "Go!";
    go.classList = "blo";
    go.style.margin = "5px";
    hp.innerHTML = "Current & Max Hp";
    hp.classList = "blo";
    hp.style.margin = "5px";

    enter.onclick = handleEnterButton;
    go.onclick = handleGoButton;
}

function handleEnterButton()
{
    currentName = charName.value;
    currentName = currentName.toLowerCase();
    setUpCharacters(currentName);
}

function setUpCharacters(currentName)
{
    for(let elem of div.children)
    {
        elem.classList = "hide";
    }

    div.appendChild(char);

    switch(currentName)
    {
        case "axolotl":
            let mapLink = document.createElement("a");
            mapLink.innerHTML = "Map Link";
            mapLink.onclick = openWindow;
            mapLink.id = "map.html?invisible-_invisible_vi";
            mapLink.classList = "blo";
            let dmLink = document.createElement("a");
            dmLink.innerHTML = "DM Link";
            dmLink.onclick = openWindow;
            dmLink.id = "dmSite.html?Axo1ot1";
            mapLink.classList = "blo";
            div.appendChild(dmLink);
            div.appendChild(mapLink);
            break;

        case "nook":
            for(let i = 0; i < 2; i++)
            {
                people.push(currentName + '-' + numToLet[i]);
            }
            break;

        case "leonier":
            for(let i = 0; i < 3; i++)
            {
                people.push(currentName + '-' + numToLet[i]);
            }
            break;

        case "razor":
            for(let i = 0; i < 2; i++)
            {
                people.push(currentName + '-' + numToLet[i]);
            }
            break;

        case "nibbly":
            for(let i = 0; i < 2; i++)
            {
                people.push(currentName + '-' + numToLet[i]);
            }
            break;
    }

    if(currentName != "axolotl")
    {
        addCharacters();
        addBorders();
        addHp();
        div.appendChild(go);

        if(oldToken != null || oldToken != undefined)
        {
            document.getElementById(`${oldToken["name"]}`).onclick();
            document.getElementById(`${oldToken["border"]}`).onclick();
            document.getElementById(`Max Hp`).value = oldToken["maxHp"];
            document.getElementById(`Current Hp`).value = oldToken["currentHp"];
            document.getElementById(`Temp Hp`).value = oldToken["tempHp"];
        }
    }
}

function openWindow()
{    
    setInterval(() => {window.open(this.id, '_blank'); location.reload();}, 2000);   
}

function addCharacters()
{
    for(let char of people)
    {
        let person = document.createElement("img");
        person.id = char;
        person.src = `images/map/tokens/${char}.png`;
        person.classList = "char";
        person.onclick = choose;
        div.appendChild(person);
    }
}

function addBorders()
{
    for(let i = 0; i < 8; i++)
    {
        let color = borders[i];
        borders[i] = document.createElement("img");
        borders[i].src = `images/map/tokens/${color}Border.png`;
        borders[i].id = color;
        borders[i].classList = "bord";
        borders[i].onclick = choose;
    }

    div.appendChild(bord);
    for(let border of borders)
    {
        div.appendChild(border);
    }
}

function addHp()
{
    div.appendChild(hp);
    let names = ["Max Hp", "Current Hp", "Temp Hp"];
    let labels = [document.createElement("h6"), document.createElement("h6"), document.createElement("h6")];
    let numbers = [document.createElement("input"), document.createElement("input"), document.createElement("input")];

    for(let i = 0; i < names.length; i++)
    {
        let seprateDiv = document.createElement("div");
        labels[i].innerHTML = names[i] + ':';
        labels[i].classList = "color-UP-yellow labelS";
        seprateDiv.appendChild(labels[i]);

        numbers[i].id = names[i];
        numbers[i].type = "number";
        numbers[i].min = "0";
        numbers[i].step = "1";
        numbers[i].style.width = "10%";
        numbers[i].classList = "numberInput";
        seprateDiv.appendChild(numbers[i])

        div.appendChild(seprateDiv);
    }
}

function choose()
{
    let classL = this.classList.value;
    if(classL.includes("char"))
    {
        let chars = document.getElementsByClassName("char");
        for(let char of chars)
        {
            char.classList = "char"
        }

        this.classList = "char selected";
    }

    else if(classL.includes("bord"))
    {
        let bords = document.getElementsByClassName("bord");
        for(let bord of bords)
        {
            bord.classList = "bord";
        }
        
        this.classList = "bord selected";
    }
}

function handleGoButton()
{
    let currentSelected = document.getElementsByClassName("selected");
    if(currentSelected.length == 2)
    {
        let curBorder = currentSelected[1].id;
        let curCharacter = currentSelected[0].id;
        createChar(curCharacter, curBorder);

        let loop = true;
        while(loop)
        {
            try 
            {
                if(div.children.length > 0)
                {
                    div.removeChild(div.children[1]);
                }

                else
                {
                    loop = false;
                    break;
                }
            } 
            
            catch (error) 
            {
                loop = false;
                break;
            }
        }

        let loading = document.createElement("h3");
        let loadingGif = document.createElement("img");
        loading.innerHTML = "Loading, AxolMap V3 now with memory...";
        loadingGif.src = "images/loadingGif.gif";
        loadingGif.style.minWidth = "10%";
        div.classList.add("center"); 
        div.appendChild(loading);
        div.appendChild(loadingGif);
        let charName = curCharacter.slice(0, curCharacter.indexOf("-"));
        setInterval(() => {window.location.href= `map.html?${charName}_${curBorder}_x`;}, 2000);
    }
}

function createChar(curCharacter, curBorder)
{
    let charName = curCharacter.slice(0, curCharacter.indexOf("-"));
    let char = {border : curBorder, currentHp : `${document.getElementById("Current Hp").value}`, maxHp : `${document.getElementById("Max Hp").value}`, tempHp : document.getElementById("Temp Hp").value, map : "", id : charName, name : curCharacter, title : " " + charName + ", ", xPos : "1", yPos : "A"};

    if(oldToken != null || oldToken != undefined)
    {
        char["title"] = oldToken["title"];
        char["xPos"] = oldToken["xPos"];
        char["yPos"] = oldToken["yPos"];
    }

    set(ref(database, `currentMap/${charName}`), char);
    set(ref(database, `playerChar/${player}/token`), char);
}