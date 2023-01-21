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
        user = user[0].toUpperCase() + user.substring(1).toLowerCase();
        currentUser = user;
        readNotes(user);
        txtFeild.value = "";
        createAddButton();
        txtFeild.setAttribute("placeholder", " ");
        hasSearched = true;
    }

    else
    {
        let enter = document.getElementById("enter");
        let title = document.getElementById("searchBar");
        let text = document.getElementById("text");

        if(title == null || text == null || title == undefined || text == undefined)
        {
            alert("Please enter both a title and text for your note.");
        }

        else
        {
            addNote(currentUser, title.value, text.value);
            setCardScreen(enter, title, text);
        }   
    }
}

function handleAddButton()
{
    let notes = document.getElementsByClassName("notes");
    let addButton = document.getElementById("addButton");

    addButton.parentNode.removeChild(addButton);
    while(notes.length > 0)
    {
        notes[0].parentNode.removeChild(notes[0]);
    }

    setAddScreen();
}

function handleCardClick()
{
    let children = this.childNodes;
    let title = document.getElementById("searchBar");
    let text = document.getElementById("text");

    currentTitle = children[0].innerHTML;
    currentText = children[1].innerHTML;
    handleAddButton();
    
    title.innerHTML = currentTitle;
    text.innerHTML = currentText;
}

function setAddScreen()
{
    let text = document.createElement("textarea");
    text.setAttribute("id", "text");
    text.setAttribute("rows", "5");
    text.setAttribute("cols", "50");
    text.placeholder = "Write Text Here";

    let addButton = document.getElementById("enter");
    addButton.innerHTML = "Upload";
    addButton.parentNode.removeChild(addButton);

    let title = document.getElementById("searchBar");
    title.placeholder = "Write Title Here";
    title.parentNode.appendChild(text);
    title.parentNode.appendChild(addButton);
    
}

function setCardScreen(enter, title, text)
{
    text.parentNode.removeChild(text);
    enter.innerHTML = "Enter";
    title.placeholder = " ";
    title.value = " ";
    readNotes(currentUser);
    createAddButton();
}

function createAddButton()
{
    let addButton = document.createElement("img");
    addButton.setAttribute("src", "images/addIcon.png");
    addButton.setAttribute("id", "addButton");
    addButton.onclick = handleAddButton;
    let noteDisplay = document.getElementById("notesDisplay");
    noteDisplay.appendChild(addButton);
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
        createCard(title, text);
    });
}

function createCard(title, text)
{
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card .bg-UP-blue notes");
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body notes");
    cardBody.onclick = handleCardClick;
    let cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerHTML = title;
    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.innerHTML = text;
    let noteDisplay = document.getElementById("notesDisplay");
    noteDisplay.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
}

window.onload = init;
let hasSearched = false;
let currentUser;
let currentTitle;
let currentText;