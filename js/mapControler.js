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
let currentCharacter = document.getElementsByClassName(htmlInfo[0]);
let temp = document.getElementById("temp");
let playerName = document.getElementById("name");
let key;
let arrows = [];

function init()
{
    arrows.push(document.getElementById("up"));
    arrows.push(document.getElementById("left"));
    arrows.push(document.getElementById("right"));
    arrows.push(document.getElementById("down"));

    for(let arrow of arrows)
    {
        arrow.onclick = handleArrow;
    }

    document.addEventListener("keydown", (ev) => {key = ev; handleArrow()});
    setMainVaribles();
}

function setMainVaribles()
{   
    htmlInfo = htmlInfo.split("?");
    htmlInfo = htmlInfo[1];
    htmlInfo = htmlInfo.split("_");
    playerName.innerHTML = htmlInfo[0];

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

    bounds = [startPos, startPos + distance * 10];
}

function moveChar(xPos, yPos)
{
    for(let prop of currentCharacter)
    {
        prop.style.left = xPos + "px";
        prop.style.top = yPos + "px";
    }   

    currentPos = [xPos, yPos];

    temp.innerHTML = `${htmlInfo[0]} X: ${currentPos[0]}, Nook Y: ${currentPos[1]}`;
}

function handleArrow()
{
    let arr = "", ke = 0;

    if(key != undefined)
    {
        key.preventDefault();
        ke = key.keyCode;
    }

    if(this != undefined)
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
}

init();