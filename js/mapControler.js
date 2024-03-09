"use strict";
let div = document.getElementById("gridMap");
let htmlInfo = window.location.href;
htmlInfo = htmlInfo.split("?");
htmlInfo = htmlInfo[1];
htmlInfo = htmlInfo.split("_");
htmlInfo[1] += "Border";

let char = [document.createElement("img"), document.createElement("img")];
char[0].title = `${char[0].id}: Paralized`;

for(let i = 0; i < 2; i++)
{
    char[i].classList = "tokens";
    char[i].src = `images/map/tokens/${htmlInfo[i]}.png`;
    char[i].id = htmlInfo[i];
    div.appendChild(char[i]);
}

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

let startPos = distance + bumper;
let bounds = [startPos, startPos + distance * 10];
let currentPos;

let temp = document.getElementById("temp");
let key;
let arrows = [];
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
    for(let prop of char)
    {
        prop.style.left = xPos + "px";
        prop.style.top = yPos + "px";
    }   

    currentPos = [xPos, yPos];

    temp.innerHTML = `Nook X: ${currentPos[0]}, Nook Y: ${currentPos[1]}`;
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