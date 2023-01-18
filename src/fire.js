"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, setDoc, getDocs, doc, collection } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

function init()
{
    let button = document.getElementById("enter");

    button.onclick = handleEnter;
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
        readNotes(user);
    }

    else
    {
        document.getElementById("notesDisplay").value = "User not gotten";
        hasSearched = true;
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

async function readNotes(user)
{
    let display = document.getElementById("notesDisplay");
    display.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, user));
    querySnapshot.forEach((doc) => 
    {
        let title = doc.id;
        let text = doc.data().Text;
        display.innerHTML = display.innerHTML + (title + ": " + text + "\n");
    });
}

function createCard(title, text)
{
    document.write
    (
        '<div class="card .bg-UP-blue">'+
            '<div class="card-body">'+
                '<h5 class="card-title">' + title + '</h5>'+
                '<p class="card-text">' + text + '</p>'+
            '</div>'+
        '</div>'
    );
}

window.onload = init;
let hasSearched = false;