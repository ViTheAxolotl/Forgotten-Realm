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
let fiveButtons = [];
let wholeData = {};
let div = document.getElementById("story");
let editDiv;
let imgs;

function init()
{
    fetch('https://vitheaxolotl.github.io/Forgotten-Realm/src/files.json').then(res => res.json()).then((json) => imgs = json);
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
            currentEOrD[0].parentElement.removeChild(currentEOrD[0]);
        }
    }

    editDiv = currentDiv;
    editB.innerHTML = "edit";
    editB.onclick = handleEdit;
    editB.classList = `eOrD ${this.classList[1]}`;
    editB.id = "edit";
    editB.style.margin = `5px 5px 5px 79px`;
    deleteB.innerHTML = "delete";
    deleteB.onclick = deleteToken;
    deleteB.classList = `eOrD ${this.classList[1]}`;
    currentDiv.appendChild(editB);
    currentDiv.appendChild(deleteB);
}

async function deleteToken()
{
    for(let key of Object.keys(wholeData))
    {
        if(wholeData[key].name == this.classList[1])
        {
            try
            { 
                await deleteDoc(doc(db, "CurrentMap", key));
            }
            
            catch (e) 
            {
                console.error("Error adding document: ", e);
            }
        }
    }
    
    resetDelete();
}
 
function handleEdit()
{
    let names = ["border", "currentHp", "maxHp", "name", "title", "xPos", "yPos"];
    let txtFeilds = [];
    let curCharacter;
    let buttons = [document.createElement("button"), document.createElement("button")];
    let buttonsName = ["edit", "back"];
    let currentEOrD = document.getElementsByClassName("eOrD");

    if(currentEOrD.length > 0)
    {
        for(let i = 0; i < 2; i++)
        {
            currentEOrD[0].parentElement.removeChild(currentEOrD[0]);
        }
    }

    for(let i = 0; i < 2; i++)
    {
        buttons[i].id = buttonsName[i];
        buttons[i].innerHTML = buttonsName[i];
        buttons[i].style.display = "inline";
        buttons[i].style.width = "80px";
    }

    buttons[0].onclick = addToken;
    buttons[0].style.margin = "5px 2.5px 5px 42%";
    buttons[1].onclick = resetDelete;
    buttons[1].style.margin = "5px 5px 5px 2.5px";

    for(let key of Object.keys(wholeData))
    {
        if(wholeData[key].name == this.classList[1])
        {
            curCharacter = wholeData[key];
        }
    }

    for(let i = 0; i < 7; i++)
    {
        let label = document.createElement("h6");
        label.innerHTML = `${names[i]}:`;
        label.style.display = "inline";
        label.classList = "color-UP-yellow";
        
        if(i == 0)
        {
            label.style.margin = `5px 5px 5px 79px`;
            txtFeilds[i] = document.createElement("select");
            txtFeilds[i].name = names[i];
            for(let key of Object.keys(imgs["borders"]))
            {
                let currentBorder = imgs["borders"][key];
                let option = document.createElement("option");
                option.value = key;
                option.text = currentBorder.slice(currentBorder.indexOf("ns/") + 2);
                option.style.backgroundImage = `url(${currentBorder})`;
                txtFeilds[i].appendChild(option);
            }
        }

        else
        {
            txtFeilds[i] = document.createElement("input");
        }
        
        txtFeilds[i].style.width = "75px";
        txtFeilds[i].id = names[i];
        txtFeilds[i].style.margin = "5px";
        editDiv.appendChild(label);
        editDiv.appendChild(txtFeilds[i]);
    }

    txtFeilds[1].value = curCharacter.currentHp;
    txtFeilds[2].value = curCharacter.maxHp;
    txtFeilds[3].value = curCharacter.name;
    txtFeilds[4].value = curCharacter.title;
    txtFeilds[5].value = curCharacter.xPos;
    txtFeilds[6].value = curCharacter.yPos;
    editDiv.appendChild(document.createElement("h6"));
    buttons.forEach(em => {editDiv.appendChild(em)});
}

function resetDelete()
{
    let aboveDiv = div.parentElement;
    div.remove();
    div = document.createElement("div");
    div.id = "story";
    div.classList = "bg-UP-purple color-UP-black col-md-12 col-sm-12";
    aboveDiv.insertBefore(div, aboveDiv.childNodes[2]);
    handleRemove();
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
    if(fiveButtons != [])
    {
        for(let button of fiveButtons)
        {
            button.remove();
        }

        fiveButtons = [];
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

async function addToken()
{
    let b = document.getElementById("border").value;
    let c = document.getElementById("currentHp").value;
    let mH = document.getElementById("maxHp").value;
    let n = document.getElementById("name").value;
    let t = document.getElementById("title").value;
    let x = document.getElementById("xPos").value;
    let y = document.getElementById("yPos").value;

    const docRef = await setDoc(doc(db, "CurrentMap", n), 
    {
        border : b,
        currentHp : c,
        maxHp : mH,
        map : "",
        name : n,
        title : n + ": " + t,
        xPos : x,
        yPos : y
    });

    resetDelete();
}

init();