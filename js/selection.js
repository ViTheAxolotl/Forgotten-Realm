"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, setDoc, getDocs, deleteDoc, doc, collection, query, where } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

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

const db = getFirestore(firebaseApp);
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
let numToLet = {0 : "", 1 : "a"};
let wholeData = {};

async function init()
{
    char.innerHTML = "Select Character";
    char.classList = "blo";
    bord.innerHTML = "Select Boarder";
    bord.classList = "blo";
    go.innerHTML = "Go! (It may take a few seconds to load)";
    go.classList = "blo";
    hp.innerHTML = "Current & Max Hp";
    hp.classList = "blo";

    enter.onclick = handleEnterButton;
    go.onclick = handleGoButton;

    const q = query(collection(db, "CurrentMap"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        wholeData[doc.id] = doc.data();
    });
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
            dmLink.id = "dmSite.html";
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
            for(let i = 0; i < 2; i++)
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
    if(this.id == "map.html?invisible-_invisible_vi")
    {
        createChar("invisible-", "invisible");
    }
    
    setInterval(() => {window.open(this.id, '_blank');}, 2000);
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
    let names = ["Current Hp", "Max Hp"];
    let labels = [document.createElement("h6"), document.createElement("h6")];
    let numbers = [document.createElement("input"), document.createElement("input")];

    for(let i = 0; i < 2; i++)
    {
        labels[i].innerHTML = names[i] + ':';
        labels[i].style.display = "inline";
        labels[i].classList = "color-UP-yellow";
        div.appendChild(labels[i]);

        numbers[i].id = names[i];
        numbers[i].type = "number";
        numbers[i].min = "0";
        numbers[i].step = "1";
        div.appendChild(numbers[i])
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
        setInterval(() => {window.location.href= `map.html?${curCharacter}_${curBorder}_x`;}, 2000);
    }
}

async function createChar(curCharacter, curBorder)
{
    let char = {border : curBorder, currentHp : "", maxHp : "", map : "", name : curCharacter, title : curCharacter + ": ", xPos : "1", yPos : "A"};
    
    for(let key of Object.keys(wholeData))
    {
        if(wholeData[key].name == char.name)
        {
            char.title = wholeData[key].title;
            char.xPos = wholeData[key].xPos;
            char.yPos = wholeData[key].yPos;
        }
    }

    const docRef = await setDoc(doc(db, "CurrentMap", curCharacter), char);
}

init();
