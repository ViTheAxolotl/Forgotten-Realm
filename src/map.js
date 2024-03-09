"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, setDoc, getDocs, deleteDoc, doc, collection, query, where } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { DISTANCE, BUMPER, MOVEMENT } from '../js/mapControler';

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
let temp = document.getElementById("temp");
let wholeData = {};
let div = document.getElementById("gridMap");
let htmlInfo = window.location.href;
let html = {};
htmlInfo = htmlInfo.split("?");
htmlInfo = htmlInfo[1];
htmlInfo = htmlInfo.split("_");
html[htmlInfo[0]] = {"border" : htmlInfo[1], "name" : html[0]};
let disAndBum = DISTANCE + BUMPER;

async function readTokens()
{
    const q = query(collection(db, "CurrentMap"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        wholeData[doc.id] = doc.data();
    });

    addTokens();
}

function addTokens()
{
    for(let key of wholeData.keys)
    {

    }

    if(!wholeData.keys.contains(htmlInfo[0]))
    {
        addCharacter(html[htmlInfo[0]]);
    }
}

function addCharacter(character)
{
    let pos = [disAndBum, disAndBum + MOVEMENT, disAndBum + (MOVEMENT * 2), disAndBum + (MOVEMENT * 3), disAndBum + (MOVEMENT * 4), disAndBum + (MOVEMENT * 5), disAndBum + (MOVEMENT * 6), disAndBum + (MOVEMENT * 7), disAndBum + (MOVEMENT * 8), disAndBum + (MOVEMENT * 9), disAndBum + (MOVEMENT * 10), disAndBum + (MOVEMENT * 11), disAndBum + (MOVEMENT * 12)];
    let yPos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
    let xPos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    let char = [document.createElement("img"), document.createElement("img")];
    char[0].src = `images/map/tokens/${character["name"]}.png`;
    char[1].src = `images/map/tokens/${character["border"]}.png`;
    char[0].title = `${character["name"]}:`;
    let x = pos[0];
    let y = pos[0];

    if(character.keys.contains("title"))
    {
        char[0].title = char[0].title + ` ${character["title"]}.`;
        x = pos[xPos.indexOf(character["xPos"])];
        y = pos[yPos.indexOf(character["yPos"])];
    }

    for(let i = 0; i < 2; i++)
    {
        char[i].classList = `tokens ${character["name"]}`;
        placeTokens(x, y, char[i]);
        div.appendChild(char[i]);
    }
}

function placeTokens(x, y, prop)
{
    prop.style.left = x + "px";
    prop.style.top = y + "px";
}

function init()
{
    readTokens();
}

init();
