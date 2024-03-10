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
let temp = document.getElementById("temp");
let wholeData = {};
let div = document.getElementById("gridMap");
let htmlInfo = window.location.href;
let html = {};
const gridMap = document.querySelector("#gridMap");
const rect = gridMap.getBoundingClientRect();
let mapSize;
let bumper;
let distance;
let movement;
let names = [];

function init()
{
    setMainVaribles();
    readTokens();
}

function setMainVaribles()
{   
    htmlInfo = htmlInfo.split("?");
    htmlInfo = htmlInfo[1];
    htmlInfo = htmlInfo.split("_");
    html[htmlInfo[0]] = {"border" : htmlInfo[1], "name" : html[0], title : ""};

    if(rect.width < 999)
    {
        mapSize = rect.width;
        bumper = 9;
        distance = Math.round(mapSize / 14);
        movement = distance - 4;
    }

    else
    {
        mapSize = (rect.width * (8 / 10));
        bumper = Math.round(rect.width / 10) + 2;
        distance = Math.round(mapSize / 14);
        movement = distance - 6;
    }
}

async function readTokens()
{
    const q = query(collection(db, "CurrentMap"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        wholeData[doc.id] = doc.data();
        names.push(doc.data().name);
    });

    addTokens();
}

function addTokens()
{
    for(let key of Object.keys(wholeData))
    {
        addCharacter(wholeData[key]);
    }

    if(!(htmlInfo[0] in names))
    {
        addCharacter(html[htmlInfo[0]]);
    }
}

function addCharacter(character)
{
    let disAndBum = distance + bumper;
    let pos = [disAndBum, disAndBum + movement, disAndBum + (movement * 2), disAndBum + (movement * 3), disAndBum + (movement * 4), disAndBum + (movement * 5), disAndBum + (movement * 6), disAndBum + (movement * 7), disAndBum + (movement * 8), disAndBum + (movement * 9), disAndBum + (movement * 10), disAndBum + (movement * 11), disAndBum + (movement * 12)];
    let yPos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
    let xPos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    let char = [document.createElement("img"), document.createElement("img")];
    char[0].src = `images/map/tokens/${character["name"]}.png`;
    char[1].src = `images/map/tokens/${character["border"]}Border.png`;
    char[0].title = `${character["name"]}:`;
    let x = pos[0];
    let y = pos[0];

    if(character.title != "")
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

init();
