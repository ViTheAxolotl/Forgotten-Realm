"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

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

export let auth = getAuth();
export let database = getDatabase();

export function toTitleCase(word)
{
    let finalWord = "";
    if(word.includes(" "))
    {
        word = word.split(" ");
        for(let singleWord of word)
        {
            finalWord += `${singleWord[0].toUpperCase() + singleWord.slice(1)} `;
        }
    }

    else
    {
        finalWord = word[0].toUpperCase() + word.slice(1);
    }

    return finalWord;
}

export function createCard(title, text, location)
{
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card .bg-UP-blue notes");
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body notes");
    let cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerHTML = title;
    cardBody.appendChild(cardTitle);
    for(let i = 0; i < text.length; i++)
    {
        let cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        cardText.style.margin = "3px";
        cardText.innerHTML = text[i];
        cardBody.appendChild(cardText);
    }
    
    let noteDisplay = document.getElementById(location);
    noteDisplay.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
}