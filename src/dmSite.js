//"use strict";
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
let fiveButtons = [];
let wholeData = {};
let div = document.getElementById("story");

function init()
{
    for(let button of document.getElementsByTagName("button"))
    {
        switch(button.id)
        {
            case "add":
                fiveButtons.push(button);
                button.onclick = handleAdd;
                break;

            case "remove":
                fiveButtons.push(button);
                button.onclick = handleRemove;
                break;

            case "changeMap":
                fiveButtons.push(button);
                button.onclick = handleChangeMap;
                break;

            case "save":
                fiveButtons.push(button);
                button.onclick = handleSave;
                break;

            case "load":
                fiveButtons.push(button);
                button.onclick = handleLoad;
                break;
        }
    }
}

async function handleAdd()
{
    hideButtons();
}

async function handleRemove()
{
    hideButtons();
    
    wholeData = {};
    const q = query(collection(db, "CurrentMap"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        wholeData[doc.id] = doc.data();
    });

    for(let key of Object.keys(wholeData))
    {
        if(key != "invisible-")
        {
            let token = [document.createElement("div"), document.createElement("img"), document.createElement("img")];
            token[0].id = `${wholeData[key].name}-div`;
            token[0].classList = "bg-UP-grey objectBorder";
            token[0].style.margin = "5px";
            token[0].style.position = "relative";
            token[0].style.minHeight = "82px";
            token[0].style.minWidth = "82px";
            token[1].src = `images/map/tokens/${wholeData[key].name}.png`;
            token[1].id = wholeData[key].name;
            token[1].classList = `tokens ${wholeData[key].name} char`;
            token[2].src = `images/map/tokens/${wholeData[key].border}Border.png`;
            token[2].id = wholeData[key].border;
            token[2].classList = `tokens ${wholeData[key].name} border_`;
            token[2].onclick = handleDeleteOrEdit;

            token[0].appendChild(token[1]);
            token[0].appendChild(token[2]);
            div.appendChild(token[0]);
        }
    }

    addDone();
}

function handleDeleteOrEdit()
{
    let currentDiv = this.parentElement;
    let currentEOrD = document.getElementsByClassName("eOrD");
    let editB = document.createElement("button");
    let deleteB = document.createElement("button");
    if(currentEOrD.length > 0)
    {
        for(let i = 0; i < 2; i++)
        {
            currentDiv.removeChild(currentDiv.lastChild);
        }
    }

    else
    {
        editB.innerHTML = "edit";
        editB.onclick = handleEdit;
        editB.classList = "eOrD";
        editB.id = "edit";
        editB.margin = "5px 5px 5px 87px";
        deleteB.innerHTML = "delete";
        deleteB.onclick = deleteToken;
        deleteB.classList = "eOrD";
        currentDiv.appendChild(editB);
        currentDiv.appendChild(deleteB);
    }
}

function deleteToken()
{

}

function handleEdit()
{
    addToken();
}

function handleChangeMap()
{
    hideButtons();
}

function handleSave()
{
    hideButtons();
}

function handleLoad()
{
    hideButtons();
}

function handleDone()
{
    location.reload();
}

function hideButtons()
{
    for(let button of fiveButtons)
    {
        button.remove();
    }
}

function addDone()
{
    let doneButton = document.createElement("button");
    doneButton.id = "done";
    doneButton.innerHTML = "Done";
    doneButton.onclick = handleDone;
    div.appendChild(doneButton);
}

function addToken()
{

}

init();