"use strict"
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
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

let db = getDatabase();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if(!user) 
    {
        alert("You need to login before using this resorce.");
        window.location.href = "loginPage.html";        
    }
});

function init()
{
    let button = document.getElementById("enter");

    button.onclick = handleEnter;
}

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