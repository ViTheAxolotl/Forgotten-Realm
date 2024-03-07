"use strict";

let char = document.getElementById("nook");
let charB = document.getElementById("nookBorder");
let characterO = [char, charB];

const gridMap = document.querySelector("#gridMap");
const RECT = gridMap.getBoundingClientRect();
let dimentions = [RECT.height, RECT.width];
let buffer = [2, (RECT.width / 10) - 15];

let startX = (dimentions[1] / 14) + buffer[1];
let startY = (dimentions[0] / 14) + buffer[0];
let xBounds = [(startX)];
let yBounds = [(startY)];
let currentPos;

let upArrow = document.getElementById("up");
let leftArrow = document.getElementById("left");
let rightArrow = document.getElementById("right");
let downArrow = document.getElementById("down");
let arrows = [upArrow, leftArrow, downArrow, rightArrow];
let temp = document.getElementById("temp");
let key;

function init()
{
    for(let arrow of arrows)
    {
        arrow.onclick = handleArrow;
    }

    document.addEventListener("keydown", (ev) => {handleArrowKey(ev)});
    moveChar(startX, startY);
}

function moveChar(xPos, yPos)
{
    for(let prop of characterO)
    {
        prop.style.left = xPos + "px";
        prop.style.top = yPos + "px";
    }   

    currentPos = [xPos, yPos];

    temp.innerHTML = `Location of ${char.id}: ${xPos}, ${yPos}.`;
}

function handleArrow()
{
    switch(this.id)
    {
        case "up":
            if(yBounds[0] != currentPos[1])
            {
                moveChar(currentPos[0], currentPos[1] - 1);
            }   
        break;
        
        case "left":
            if(yBounds[0] != currentPos[1])
            {
                moveChar(currentPos[0] - 1, currentPos[1]);
            }   
        break;
        
        case "down":
            //if(yBounds[0] != currentPos[1])
            //{
                moveChar(currentPos[0], currentPos[1] + 1);
            //}       
        break;
        
        case "right":
            //if(yBounds[0] != currentPos[1])
            //{
                moveChar(currentPos[0] + 1, currentPos[1]);
            //}               
        break;
    }
}

function handleArrowKey(ev)
{
    ev.preventDefault(); // Prevent Browser scroll if overflow

    switch (ev.keyCode) 
    {
        case 38: //Up
            if(yBounds[0] <= currentPos[1])
            {
                moveChar(currentPos[0], currentPos[1] - 1);
            }   
        break;
        
        case 37: //Left
            if(xBounds[0] <= currentPos[0])
            {
                moveChar(currentPos[0] - 1, currentPos[1]);
            }   
        break;
        
        case 40: //Down
            //if(yBounds[0] != currentPos[1])
            //{
                moveChar(currentPos[0], currentPos[1] + 1);
            //}       
        break;
        
        case 39: //Right
            //if(yBounds[0] != currentPos[1])
            //{
                moveChar(currentPos[0] + 1, currentPos[1]);
            //}               
        break;
    }
}

init();