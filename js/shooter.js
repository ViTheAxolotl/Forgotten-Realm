"use strict";

let display;
let target;
let ball = "noBall";
let seconds = 1000;
let yesBall = "../images/Carnival/yesBall.png";
let noBall = "../images/Carnival/noBall.png";
let isGameOn = false;
let isPointGotten = false;
let points = 0;

function init()
{
    display = document.getElementById("display");
    target = document.getElementById("target");
    display.onclick = beginGame;
    target.onclick = managePoints;
}

function beginGame()
{
    if(!isGameOn)
    {
        isGameOn = true;
        display.innerHTML = "Alright Begining in";
        let y = 1;
        points = 0;
        
        for(let i = 3; i >= 0; i--)
        {
            setTimeout(() => {display.innerHTML = i + "...";}, seconds * y);
            y++;
        }

        setTimeout(() => {beginTimer();}, 4000);
    }
}

function beginTimer()
{
    let currentSecond = 0;
    let waitForSeconds = Math.round(Math.random() * 10);

    updatePoints();

    for(let i = 0; i < 3; i++)
    {
        waitForSeconds = Math.round(Math.random() * 10);
        currentSecond = seconds * (i * 10);
        currentSecond = (seconds * waitForSeconds) + currentSecond;
        setTimeout(() => {switchBall();}, currentSecond, console.log(currentSecond));
        
        waitForSeconds = Math.random() * .9999999999;
        currentSecond = (seconds * waitForSeconds) + currentSecond;
        setTimeout(() => {switchBall();}, currentSecond, console.log(currentSecond));
    }
    
    setTimeout(() => {display.innerHTML = "Game finished with " + points + " points. Click to play again."; isGameOn = false; isPointGotten = true;}, seconds * 31);
}

function updatePoints()
{
    display.innerHTML = "Points = " + points;
}

function switchBall()
{
    isPointGotten=false;
    if(ball == "noBall")
    {
        target.src = yesBall;
        ball = "yesBall";
    }

    else
    {
        target.src = noBall;
        ball = "noBall";
    }   
}

function managePoints()
{
    if(!isPointGotten)
    {
        if(ball == "yesBall")
        {
            points++;
            updatePoints();
        }

        else
        {
            points--;
            updatePoints();
        }

        isPointGotten = true;
    }
}

init();