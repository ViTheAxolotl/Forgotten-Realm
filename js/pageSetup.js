"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

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
const auth = getAuth();
let log;
let isLoggedIn = false;
let nav = document.getElementsByTagName("nav");
let url = window.location.href.split("/");
let params = document.body.getElementsByTagName('script');
let query = params[0].classList;
let parentFolder = query[0];
let wholeChars = {};
let name;

let imageLocation;
let jsaLocation;
let mainLocation;

const charRef = ref(database, 'playerChar/');
onValue(charRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeChars = data;
    navBarSetup();
});

if(parentFolder == "noParent")
{
    mainLocation = "";
    imageLocation = "images/";
}

if(parentFolder == "downOne")
{
    mainLocation = "../";
    imageLocation = "../images/";
}

onAuthStateChanged(auth, (user) => {
    if (user) 
    {
        name = auth.currentUser.email.split("@");
        name = toTitleCase(name[0]);

        log = `</ul>
            </div>
            <a class="nav-link" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="float: right; min-width: 6%;">
                <button class="link-primary bg-UP-grey">${name}</button
            </a>
            <ul class="dropdown-menu bg-dark" style="right: 0; left: auto;" aria-labelledby="navbarScrollingDropdown">
                <li class="nav-item"><a class="nav-link active" aria-current="page" id = "logoutButton">Logout</a></li>
            </ul>`;
            isLoggedIn = true;
    } 
    
    else 
    {
        // User is signed out
        log = `</ul>
            </div>
            <a class="navbar-brand" style="float = right" href="${mainLocation}loginPage.html?${url.slice(-1)}"><button class="link-primary bg-UP-grey">Login</button></a>);`;
    }
});

function init()
{
    discordSetup();
}

function navBarSetup()
{
    nav[0].innerHTML = `<div class="container-fluid">
        <a class="navbar-brand" href="${mainLocation}index.html"><img src = "${imageLocation}UP.png" title = "Forgotten Realm" alt = "Forgotten Realm" width = "70" height = "70"/></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent"> 
            <ul class="navbar-nav me-auto my-2 my-lg-0 " style="--bs-scroll-height: 100px;"> 
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}index.html">Forgotten Realm</a></li>
                <li class="nav-item dropdown"> 
                    <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        World Information
                    </a>
                    <ul class="dropdown-menu bg-dark" aria-labelledby="navbarScrollingDropdown">
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}creationStory.html">Birth Of The Universe</a></li>
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}calamity.html">The Calamity</a></li>
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}deities.html">Deities</a></li>
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}characters.html">Characters</a></li>
                    </ul>
                </li>
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}mapAndTowns.html">Maps</a></li>
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}questAndNotes.html">Quests & Personal Notes</a></li> 
                <li class="nav-item dropdown"> 
                    <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Map Board
                    </a>
                    <ul class="dropdown-menu bg-dark" aria-labelledby="navbarScrollingDropdown">
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}selection.html">Change Token</a></li>
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}map.html?${wholeChars[name]["token"]["id"]}_${wholeChars[name]["token"]["border"]}_x}">Quick Start</a></li>
                    </ul>
                </li>
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}recap.html">Sessions Recap</a></li> 
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}itemIndex.html">Magic Item Index</a></li>);    
                ${log}
    </div>`;

    if(isLoggedIn){document.getElementById("logoutButton").onclick = logout;}
}

function logout()
{
    signOut(auth).then(() => 
    {
        // Sign-out successful.
        location.reload();
    }).catch((error) => {
        alert(error);
    });
}

function discordSetup()
{
    nav[0].innerHTML = nav[0].innerHTML + `<script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async defer>
        new Crate(
        {
            server: "1042157480463040613", 
            channel: "1042157480463040616",
        })
        </script>`;
}

function copyrightSetup()
{
    let footer = document.getElementById("footer");
    let copyright = document.createElement("h6");
    footer.appendChild(copyright);

    copyright.innerHTML = 'Copyright &copy; Vi Snyder '+ new Date().getFullYear() + ''; 
}

function toTitleCase(word)
{
    let finalWord = word[0].toUpperCase() + word.slice(1);
    return finalWord;
}

init();

document.onreadystatechange = function () 
{
    if(document.readyState == "complete") 
    {
        copyrightSetup();
    }
}