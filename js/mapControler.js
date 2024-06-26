"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

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
const currentTORef = ref(database, 'currentTO/');
onValue(currentTORef, (snapshot) => 
{
    const data = snapshot.val();
    wholeTO = data;
});

const gridMap = document.querySelector("#gridMap");
const rect = gridMap.getBoundingClientRect();
let mapSize;
let bumper;
let distance;
let movement;
let bounds;
let currentPos;
let htmlInfo = window.location.href;
let currentCharacter;
let playerName = document.getElementById("name");
let key;
let keyControl;
let arrows = [];
let currentHp;
let maxHp;
let buttons;
let pos;
let div = document.getElementById("grid");
let currentBorders = document.getElementsByClassName("border_");
let wholeTO = {};

function init()
{
    arrows.push(document.getElementById("up"));
    arrows.push(document.getElementById("left"));
    arrows.push(document.getElementById("right"));
    arrows.push(document.getElementById("down"));
    
    currentHp = document.getElementById("current");
    currentHp.onchange = updateHp;
    maxHp = document.getElementById("max");
    maxHp.onchange = addUpdate;

    for(let arrow of arrows)
    {
        arrow.onclick = handleArrow;
        arrow.touchstart = handleArrow;
    }

    document.addEventListener("keydown", (ev) => {key = ev.key.slice(ev.key.indexOf("w") + 1).toLowerCase(); keyControl = ev; let keyValues = ["left", "right", "down", "up"]; if(keyValues.includes(key) && ev.ctrlKey) {handleArrow();}});
    setMainVaribles();
}

function setMainVaribles()
{   
    buttons = document.getElementsByClassName("inOrDe");
    htmlInfo = htmlInfo.split("?");
    htmlInfo = htmlInfo[1];
    htmlInfo = htmlInfo.split("_");
    currentCharacter = document.getElementsByClassName(htmlInfo[0]);
    playerName.innerHTML = htmlInfo[0].charAt(0).toUpperCase() + htmlInfo[0].slice(1);

    let hiddenVi = document.getElementsByClassName("isVi");

    if(htmlInfo[2] != "vi")
    {
        for(let elem of hiddenVi)
        {
            elem.style.display = "none";
        }
    }

    if(rect.width < 999)
    {
        mapSize = rect.width;
        bumper = 9;
        distance = Math.round(mapSize / 14);
        movement = distance - 4;
    }

    else
    {
        mapSize = (rect.width * (8 / 10));
        bumper = Math.round(rect.width / 10) + 2;
        distance = Math.round(mapSize / 14);
        movement = distance - 6;
    }

    let disAndBum = distance + bumper;
    pos = [disAndBum, disAndBum + movement, disAndBum + (movement * 2), disAndBum + (movement * 3), disAndBum + (movement * 4), disAndBum + (movement * 5), disAndBum + (movement * 6), disAndBum + (movement * 7), disAndBum + (movement * 8), disAndBum + (movement * 9), disAndBum + (movement * 10), disAndBum + (movement * 11), disAndBum + (movement * 12)];
    bounds = [pos[0], pos[12]];

    for(let button of buttons)
    {
        if(button.innerHTML == "+")
        {
            button.onclick = increaseValue;
        }

        else
        {
            button.onclick = decreaseValue;
        }
    }
}

function increaseValue()
{
    let cHp = parseInt(currentHp.value);
    let mHp = parseInt(maxHp.value);

    if(this.name == "current")
    {
        if(!(cHp + 1 > mHp))
        {
            currentHp.value = `${cHp + 1}`;
        }
    } 

    else if(this.name == "max")
    {
        maxHp.value = `${mHp + 1}`;
    }

    else if(this.name == "title")
    {
        let title = document.getElementById("title");
        let status = document.getElementById("status");

        title.innerHTML += ` ${status.value.charAt(0).toUpperCase() + status.value.slice(1)},`;
    }

    else if(this.name == "turn")
    {
        handleChangeInTurn("up");
        return;
    }

    for(let prop of currentCharacter)
    {
        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }
}

function decreaseValue()
{
    let cHp = parseInt(currentHp.value);
    let mHp = parseInt(maxHp.value);

    if(this.name == "current")
    {
        if(!(cHp - 1 < 0))
        {
            currentHp.value = `${cHp - 1}`;
        }
    } 
    
    else if(this.name == "max")
    {
        if(!(mHp - 1 < cHp))
        {
            maxHp.value = `${mHp - 1}`;
        }
    }

    else if(this.name == "title")
    {
        let title = document.getElementById("title");
        let status = document.getElementById("status");

        title.innerHTML = title.innerHTML.replace(` ${status.value.charAt(0).toUpperCase() + status.value.slice(1)},`, "");
    }

    else if(this.name == "turn")
    {
        handleChangeInTurn("down");
        return;
    }

    for(let prop of currentCharacter)
    {
        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }
}

function changeTOValue(data, sit)
{
    let sel = "false";
    
    if(sit == "set")
    {
        sel = "true";
    }

    set(ref(database, `currentTO/${data.charName}`),
    {
        charName : data.charName,
        position : data.position,
        selected : sel
    });
}

function handleChangeInTurn(dirrection)
{
    let curSelected;
    let newSelected;
    let newPosition;

    for(let key of Object.keys(wholeTO))
    {
        if(wholeTO[key].selected == "true")
        {
            curSelected = key;
            break;
        }
    }

    if(dirrection == "up")
    {
        if(wholeTO[curSelected].position == Object.keys(wholeTO).length){newPosition = "1";}
        else{newPosition = `${parseInt(wholeTO[curSelected].position) + 1}`}
    }
        
    else if(dirrection == "down")
    {
        if(wholeTO[curSelected].position == "1"){newPosition = `${Object.keys(wholeTO).length}`;}
        else{newPosition = `${parseInt(wholeTO[curSelected].position) - 1}`}
    }

    for(let key of Object.keys(wholeTO))
    {
        if(dirrection == "up" && wholeTO[key].position == newPosition){newSelected = key; break;}
        else if(dirrection == "down" && wholeTO[key].position == newPosition){newSelected = key; break;}
    }

    document.getElementById(`${curSelected}-div`).classList.remove("selected");
    document.getElementById(`${newSelected}-div`).classList.add("selected");

    changeTOValue(wholeTO[curSelected], "unset");
    changeTOValue(wholeTO[newSelected], "set");
}

function moveChar(xPos, yPos)
{
    for(let prop of currentCharacter)
    {
        prop.style.left = xPos + "px";
        prop.style.top = yPos + "px";
        prop.classList += " update";
    }   
}

function addUpdate()
{
    for(let prop of currentCharacter)
    {
        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }
}

function updateHp()
{
    let hpImg;
    let maxHp = maxHp.value;

    for(let prop of currentCharacter)
    {
        if(prop.classList.contains("hp"))
        {
            hpImg = prop;
        }

        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }

    if(parseInt(this.value) > parseInt(maxHp))
    {
        this.value = maxHp;
    }

    let fraction = parseInt(this.value) / parseInt(maxHp);

    if(fraction == 1)
    {
        hpImg.src = "images/map/hpBar/hpBar1.png";
    }

    else if(fraction >= .8)
    {
        hpImg.src = "images/map/hpBar/hpBar2.png";
    }

    else if(fraction >= .6)
    {
        hpImg.src = "images/map/hpBar/hpBar3.png";
    }

    else if(fraction >= .4)
    {
        hpImg.src = "images/map/hpBar/hpBar4.png";
    }

    else if(fraction >= .2)
    {
        hpImg.src = "images/map/hpBar/hpBar5.png";
    }

    else if(fraction == 0)
    {
        hpImg.src = "images/map/hpBar/hpBar6.png";
    }  
}

function handleArrow()
{
    let dirrection = "";
    currentPos = [parseInt(currentCharacter[0].style.left.replace("px", "")), parseInt(currentCharacter[0].style.top.replace("px", ""))];

    for(let token of currentCharacter)
    {
        let title = token.title;
        if(title != undefined)
        {
            if(title.includes("Large"))
            {
                bounds = [pos[0], pos[11]];
                break;
            }

            else if(title.includes("Huge"))
            {
                bounds = [pos[0], pos[10]];
                break;
            }

            else if (title.includes("Gargantuan"))
            {
                bounds = [pos[0], pos[9]];
                break;
            }

            else
            {
                bounds = [pos[0], pos[12]];
            }
        }
    }

    if(key != undefined)
    {
        keyControl.preventDefault();
        dirrection = key;
    }

    if (this != undefined)
    {
        dirrection = this.id;
    }

    if(dirrection == "up")
    {
        if(bounds[0] < currentPos[1])
        {
            moveChar(currentPos[0], currentPos[1] - movement);
        }   
    }

    else if (dirrection == "left")
    {
        if(bounds[0] < currentPos[0])
        {
            moveChar(currentPos[0] - movement, currentPos[1]);
        }
    }

    else if (dirrection == "down")
    {
        if(bounds[1] > currentPos[1])
        {
            moveChar(currentPos[0], currentPos[1] + movement);
        }       
    }

    else if (dirrection == "right")
    {
        if(bounds[1] > currentPos[0])
        {
            moveChar(currentPos[0] + movement, currentPos[1]);
        } 
    }
}

init();
