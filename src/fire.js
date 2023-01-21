"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, setDoc, getDocs, deleteDoc, doc, collection } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

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

function init()
{
    let button = document.getElementById("enter");

    button.onclick = handleEnter;
}

function handleEnter()
{
    if (hasSearched == false)
    {
        let txtFeild = elements["searchBar"];
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
        let enter = elements["enterButton"];
        let title = elements["searchBar"];
        let text = elements["text"];

        if(title.value == null || text.value == null || title.value == "" || text.value == "")
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
    let notes = elements["notes"];
    let addButton = elements["addButton"];

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

    elements["searchBar"].value = currentTitle;
    elements["text"].value = currentText;
}

function handleDeleteButton()
{
    deleteNote();
    setCardScreen(elements["enterButton"], elements["searchBar"], elements["text"]);
}

function setAddScreen()
{
    let text = document.createElement("textarea");
    text.setAttribute("id", "text");
    text.setAttribute("rows", "5");
    text.setAttribute("cols", "50");
    text.placeholder = "Write Text Here";

    let enterButton = elements["enterButton"];
    enterButton.innerHTML = "Upload";
    enterButton.parentNode.removeChild(enterButton);

    let title = elements["searchBar"];
    title.placeholder = "Write Title Here";
    title.parentNode.appendChild(text);
    title.parentNode.appendChild(enterButton);
    
}

function setCardScreen(enter, title, text)
{
    let deleteButton = elements["deleteButton"];
    deleteButton.parentNode.removeChild(deleteButton);
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

    let instructions = document.createElement("p");
    instructions.setAttribute("id", "instruc");
    instructions.setAttribute("class", "center");
    instructions.innerHTML = "Click a note to edit it, or delete it.";

    let noteDisplay = elements["notesDisplay"];
    noteDisplay.appendChild(addButton);
    noteDisplay.appendChild(instructions);
}

function createDeleteButton()
{
    let deleteButton = document.createElement("img");
    deleteButton.setAttribute("src", "images/trashIcon.png");
    deleteButton.setAttribute("id", "deleteButton");
    deleteButton.onclick = handleDeleteButton;

    let instructions = elements["instructions"];
    instructions.innerHTML = "Type in a title and description for your note. If you change your mind, hit the trash icon.";

    let enterButton = elements["enterButton"];
    enterButton.innerHTML = "Upload";
    enterButton.parentNode.removeChild(enterButton);

    let notes = elements["notes"];
    notes.appendChild(deleteButton);
    notes.appendChild(enterButton);
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
    let display = elements["notesDisplay"];
    display.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, user));
    querySnapshot.forEach((doc) => 
    {
        let title = doc.id;
        let text = doc.data().Text;
        createCard(title, text);
    });
}

async function deleteNote()
{
    if(currentTitle != undefined)
    {
        await deleteDoc(doc(db, currentUser, currentTitle));
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
    let noteDisplay = elements["noteDisplay"];
    noteDisplay.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
}

let elements = 
{
    "enterButton" : document.getElementById("enter"),
    "searchBar" : document.getElementById("searchBar"),
    "text" : document.getElementById("text"),
    "notes" : document.getElementsByClassName("notes"),
    "addButton" : document.getElementById("addButton"),
    "deleteButton" : document.getElementById("deleteButton"),
    "instructions" : document.getElementById("instruc"),
    "notesDisplay" : document.getElementById("notesDisplay")
}

window.onload = init;
let hasSearched = false;
let currentUser;
let currentTitle;
let currentText;