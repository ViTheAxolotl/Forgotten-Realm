"use strict";

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
let arrows = [];
let currentHp;
let maxHp;
let buttons;
let div = document.getElementById("grid");
let currentBorders = document.getElementsByClassName("border_");

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
    }

    div.addEventListener("onkeydown", (ev) => {key = ev; handleArrow()});
    setMainVaribles();
}

function setMainVaribles()
{   
    buttons = document.getElementsByClassName("inOrDe");
    htmlInfo = htmlInfo.split("?");
    htmlInfo = htmlInfo[1];
    htmlInfo = htmlInfo.split("_");
    currentCharacter = document.getElementsByClassName(htmlInfo[0]);
    let letterRemover = htmlInfo[0].indexOf("-");
    playerName.innerHTML = htmlInfo[0].charAt(0).toUpperCase() + htmlInfo[0].slice(1, letterRemover);

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

    bounds = [distance + bumper, (distance + bumper) + distance * 10];

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

    for(let prop of currentCharacter)
    {
        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }
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
    let arr = "", ke = 0;
    currentPos = [parseInt(currentCharacter[0].style.left.replace("px", "")), parseInt(currentCharacter[0].style.top.replace("px", ""))];

    for(let token of currentCharacter)
    {
        let title = token.title;
        if(title != undefined)
        {
            if(title.includes("Large"))
            {
                bounds = [distance + bumper, (distance + bumper) + distance * 9];
                break;
            }

            else if(title.includes("Huge"))
            {
                bounds = [distance + bumper, (distance + bumper) + distance * 7.8];
                break;
            }

            else if (title.includes("Gargantuan"))
            {
                bounds = [distance + bumper, (distance + bumper) + distance * 7.04];
                break;
            }

            else
            {
                bounds = [distance + bumper, (distance + bumper) + distance * 10];
            }
        }
    }

    if(key != undefined)
    {
        key.preventDefault();
        ke = key.keyCode;

    }

    else if (this != undefined)
    {
        arr = this.id;
    }

    if(arr == "up" || ke == 38)
    {
        if(bounds[0] < currentPos[1])
        {
            moveChar(currentPos[0], currentPos[1] - movement);
        }   
    }

    else if (arr == "left" || ke == 37)
    {
        if(bounds[0] < currentPos[0])
        {
            moveChar(currentPos[0] - movement, currentPos[1]);
        }
    }

    else if (arr == "down" || ke == 40)
    {
        if(bounds[1] > currentPos[1])
        {
            moveChar(currentPos[0], currentPos[1] + movement);
        }       
    }

    else if (arr == "right" || ke == 39)
    {
        if(bounds[1] > currentPos[0])
        {
            moveChar(currentPos[0] + movement, currentPos[1]);
        } 
    }

    return this;
}

init();