"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

function init()
{
    let buttons = document.getElementsByTagName("button");

    buttons[0].onclick = handleEnter;
}

const firebaseApp = initializeApp
({
    apiKey: "AIzaSyDojcHZEmju8ix9EK8hQcvg3jsqZ4Okub0",
    authDomain: "unbalancedpowers.firebaseapp.com",
    projectId: "unbalancedpowers",
    storageBucket: "unbalancedpowers.appspot.com",
    messagingSenderId: "88358926340",
    appId: "1:88358926340:web:a9837d91bcc8f28461dd51",
    measurementId: "G-FYM8384HMN"
});

const db = getFirestore(firebaseApp);

function handleEnter()
{
    if (hasSearched == false)
    {
        let txtFeild = document.getElementById("searchBar");
        let user = txtFeild.value;
        document.getElementById("notesDisplay").value = user;
    }
}

async function addNote(user, title, text)
{
    try 
    {
        const docRef = await setDoc(doc(db, user, title), 
        {
            Title : title,
            Text: text,
        });
    } 
    
    catch (e) 
    {
        console.error("Error adding document: ", e);
    }
}

window.onload = init;
let hasSearched = false;
addNote("Test", "Written Test", "This is to see if we can write a test.");