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
let pos; 
let yPos;
let xPos;
let tokens = [];

function init()
{
    setMainVaribles();
    readTokens();
    
    //while(true)
    {
        timer();
    }
}

function setMainVaribles()
{   
    htmlInfo = htmlInfo.split("?");
    htmlInfo = htmlInfo[1];
    htmlInfo = htmlInfo.split("_");
    html[htmlInfo[0]] = {"border" : htmlInfo[1], "name" : htmlInfo[0], title : ""};

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

    let disAndBum = distance + bumper;
    pos = [disAndBum, disAndBum + movement, disAndBum + (movement * 2), disAndBum + (movement * 3), disAndBum + (movement * 4), disAndBum + (movement * 5), disAndBum + (movement * 6), disAndBum + (movement * 7), disAndBum + (movement * 8), disAndBum + (movement * 9), disAndBum + (movement * 10), disAndBum + (movement * 11), disAndBum + (movement * 12)];
    yPos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
    xPos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
}

async function readTokens()
{
    wholeData = {};
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
    let currentTokens = document.getElementsByClassName("tokens");
    if(currentTokens.length != 0)
    {
        for(let token of currentTokens)
        {
            if(!token.classList.contains("update"))
            {
                token.remove();
            }
        }
    }

    for(let key of Object.keys(wholeData))
    {
        addCharacter(wholeData[key], false);
    }

    if(!(names.includes(htmlInfo[0])))
    {
        addCharacter(html[htmlInfo[0]], true);
    }
}

function addCharacter(character, update)
{
    if(document.getElementById(character["name"]) == null)
    {
        let char = [document.createElement("img"), document.createElement("img")];
        char[0].src = `images/map/tokens/${character["name"]}.png`;
        char[0].id = character["name"];
        char[0].title = `${character["name"]}:`;
        char[0].classList = `tokens ${character["name"]} char`;
        char[1].src = `images/map/tokens/${character["border"]}Border.png`;
        char[1].id = character["border"];
        char[1].classList = `tokens ${character["name"]} border}`;
        let x = pos[0];
        let y = pos[0];

        if(character.title != "")
        {
            char[0].title = `${character["title"]}.`;
            x = pos[xPos.indexOf(character["xPos"])];
            y = pos[yPos.indexOf(character["yPos"])];
        }

        for(let i = 0; i < 2; i++)
        {
            placeTokens(x, y, char[i]);
            
            if(update)
            {
                char[i].classList += " update";
            }

            div.appendChild(char[i]);
        }
    }
}

function placeTokens(x, y, prop)
{
    prop.style.left = x + "px";
    prop.style.top = y + "px";
}

function timer()
{
    let seconds = 1000;
    setTimeout(() => {checkUpdates()}, seconds * 20);
    setTimeout(() => {readTokens()}, seconds * 30);
}

function checkUpdates()
{
    tokens = [];

    names.push(htmlInfo[0]);
    for(let name of names)
    {
        let token = document.getElementById(name);
        if(token != null)
        {
            if(token.classList.contains("update"))
            {
                updateToken(token);
            }

            tokens.push(token);
        }
    }
}

async function updateToken(token)
{
    try 
    {
        let borderColor;
        let x;
        let y;
        let currentTokens = document.getElementsByClassName(htmlInfo[0]);

        for(let token of currentTokens)
        {
            token.classList = `${token.classList[0]} ${token.classList[1]}, ${token.classList[2]}`;
            if(token.classList[2] == "border")
            {
                borderColor = token.src.split('/');
                borderColor = border[3].slice(0, border[3].indexOf("Border"));
            }
        }

        x = xPos[pos.indexOf(token.style.left.replace("px", ""))];
        y = yPos[pos.indexOf(token.style.top.replace("px", ""))];

        const docRef = await setDoc(doc(db, "CurrentMap", token.id), 
        {
            border : borderColor,
            currentHp : "",
            maxHp : "",
            map : "",
            name : token.id,
            title : token.title,
            xPos : x,
            yPos : y
        });
    } 
    
    catch (e) 
    {
        console.error("Error adding document: ", e);
    }
}

init();
