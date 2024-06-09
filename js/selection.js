"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

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
let enter = document.getElementById("enter");
let charName = document.getElementById("name");
let currentName;
let div = document.getElementById("story");
let characters = ["nook", "nibbly", "leonier", "razor", "axolotl"];
let borders = ["blue", "golden", "green", "grey", "orange", "pink", "purple", "red"];
let char = document.createElement("h3");
let bord = document.createElement("h3");
let hp = document.createElement("h3");
let go = document.createElement("button");
let people = [];
let numToLet = {0 : "", 1 : "a", 2 : "b"};

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

    if(characters.includes(currentName))
    {
        setUpCharacters(currentName);
    }
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
        person.onclick = select;
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
        borders[i].onclick = select;
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
    let names = ["Max Hp", "Current Hp"];
    let labels = [document.createElement("h6"), document.createElement("h6")];
    let numbers = [document.createElement("input"), document.createElement("input")];

    for(let i = 0; i < 2; i++)
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

function select()
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
        loading.innerHTML = "Loading, AxolMap V2 now with less delay...";
        loadingGif.src = "images/loadingGif.gif";
        loadingGif.style.minWidth = "10%";
        div.appendChild(loading);
        div.appendChild(loadingGif);
        setInterval(() => {window.location.href= `map.html?${curCharacter}_${curBorder}_x`;}, 2000);
    }
}

function createChar(curCharacter, curBorder)
{
    let char = {border : curBorder, currentHp : `${document.getElementById("Current Hp").value}`, maxHp : `${document.getElementById("Max Hp").value}`, map : "", id : curCharacter.slice(0, curCharacter.indexOf("-")), name : curCharacter, title : " ", xPos : "1", yPos : "A"};

    set(ref(database, `currentMap/${curCharacter.slice(0, curCharacter.indexOf("-"))}`), char);
}

init();
