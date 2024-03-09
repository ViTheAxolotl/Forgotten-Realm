"use strict";

const GRIDMAP = document.querySelector("#gridMap");
const RECT = GRIDMAP.getBoundingClientRect();
let mapSize;
let bumper;

let distance = Math.round(mapSize / 14);
let movement = distance - 6;

if(RECT.width < 999)
{
    mapSize = RECT.width;
    bumper = 9;
    distance = Math.round(mapSize / 14);
    movement = distance - 4;
}

else
{
    mapSize = (RECT.width * (8 / 10));
    bumper = Math.round(RECT.width / 10) + 2;
    distance = Math.round(mapSize / 14);
    movement = distance - 6;
}

const DISTANCE = distance;
const BUMPER = bumper;
const MOVEMENT = movement;
let startPos = distance + bumper;
let bounds = [startPos, startPos + distance * 10];
let currentPos;

let temp = document.getElementById("temp");
let playerName = document.getElementById("name");
let key;
let arrows = [];
let currentCharacter;
arrows.push(document.getElementById("up"));
arrows.push(document.getElementById("left"));
arrows.push(document.getElementById("right"));
arrows.push(document.getElementById("down"));

function init()
{
    for(let arrow of arrows)
    {
        arrow.onclick = handleArrow;
    }

    document.addEventListener("keydown", (ev) => {key = ev; handleArrow()});
    moveChar(startPos, startPos);
}

function moveChar(xPos, yPos)
{
    let htmlInfo = window.location.href;
    htmlInfo = htmlInfo.split("?");
    htmlInfo = htmlInfo[1];
    htmlInfo = htmlInfo.split("_");
    currentCharacter = document.getElementsByClassName(htmlInfo[0]);
    playerName.innerHTML = htmlInfo[0];

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