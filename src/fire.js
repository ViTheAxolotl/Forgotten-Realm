"use strict"
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

let database = getDatabase();
const auth = getAuth();
let wholeNotes = {};
let player;
let notesRef;

onAuthStateChanged(auth, (user) => 
{
    if(!user) 
    {
        alert("You need to login before using this resource. Click Ok and be redirected");
        window.location.href = "loginPage.html?questAndNotes.html";        
    }

    else
    {
        let user = auth.currentUser.email.split("@");
        player = toTitleCase(user[0]);
        notesRef = ref(database, `playerChar/${player}/notes`);
    }
});

onValue(notesRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeNotes = data;
    readNotes(player);
    createAddButton();
    txtFeild.setAttribute("placeholder", " ");
});

function init()
{
    let button = document.getElementById("enter");

    button.onclick = handleEnter;
}

function toTitleCase(word)
{
    let finalWord = word[0].toUpperCase() + word.slice(1);
    return finalWord;
}

function handleEnter()
{
    let enter = document.getElementById("enter");
    let title = document.getElementById("searchBar");
    let text = document.getElementById("text");

    if(title.value == null || text.value == null || title.value == "" || text.value == "")
    {
        alert("Please enter both a title and text for your note.");
    }

    else
    {
        addNote(title.value, text.value);
        //setCardScreen(enter, title, text);
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
    createDeleteButton();
}

function handleCardClick()
{
    let children = this.childNodes;

    currentTitle = children[0].innerHTML;
    currentText = children[1].innerHTML;
    handleAddButton();
    
    let title = document.getElementById("searchBar");
    let text = document.getElementById("text");
    title.value = currentTitle;
    text.value = currentText;
}

function handleDeleteButton()
{
    let enter = document.getElementById("enter");
    let title = document.getElementById("searchBar");
    let text = document.getElementById("text");

    deleteNote();
    setCardScreen(enter, title, text);
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
    let deleteButton = document.getElementById("deleteButton");
    deleteButton.parentNode.removeChild(deleteButton);
    text.parentNode.removeChild(text);
    enter.innerHTML = "Enter";
    title.placeholder = " ";
    title.value = " ";
    //readNotes(currentUser);
    //createAddButton();
}

function createAddButton()
{
    let addButton = document.createElement("img");
    addButton.setAttribute("src", "images/addIcon.png");
    addButton.setAttribute("id", "addButton");
    addButton.onclick = handleAddButton;

    let instructions = document.createElement("p");
    instructions.setAttribute("id", "instruc");
    instructions.setAttribute("class", "center");
    instructions.innerHTML = "Click a note to edit it, or delete it.";

    let noteDisplay = document.getElementById("notesDisplay");
    noteDisplay.appendChild(addButton);
    noteDisplay.appendChild(instructions);
}

function createDeleteButton()
{
    let deleteButton = document.createElement("img");
    deleteButton.setAttribute("src", "images/trashIcon.png");
    deleteButton.setAttribute("id", "deleteButton");
    deleteButton.onclick = handleDeleteButton;

    let instructions = document.getElementById("instruc");
    instructions.innerHTML = "Type in a title and description for your note. If you change your mind, hit the trash icon.";

    let addButton = document.getElementById("enter");
    addButton.innerHTML = "Upload";
    addButton.parentNode.removeChild(addButton);

    let notes = document.getElementById("notes");
    notes.appendChild(deleteButton);
    notes.appendChild(addButton);
}

async function addNote(title, text)
{
    try 
    {
        set(ref(database, `playerChar/${player}/notes/${title}`),
        {
            Title : title,
            Text: text
        });
    } 
    
    catch (e) 
    {
        console.error("Error adding document: ", e);
    }
}

async function readNotes()
{
    let display = document.getElementById("notesDisplay");
    display.innerHTML = "";

    for(let key of Object.keys(wholeNotes))
    {
        createCard(wholeDB[key]["Title"], wholeDB[key]["Text"]);
    }
}

async function deleteNote()
{
    if(currentTitle != undefined)
    {
        set(ref(database, `playerChar/${player}/notes/${currentTitle}`), null);
    }
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
let currentTitle;
let currentText;