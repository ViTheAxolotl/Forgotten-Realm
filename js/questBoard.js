"use strict";
function init()
{ 
    let float = 
    {
        1 : "left",
        2 : "left",
        3 : "right"
    };

    let x = 1;
    for(let i = 1; i < 4; i++)
    {
        document.write('<div id = "qBCol' + i + '>');
        for(let y = 0; y < 3; y++)
        {
            document.write('<div id = "qBCell' + x + '">' + emptyCard() + '</div>');
            x++;
        }
    }
    
    setUpCards();
}

function createCard(title, text, status, cell)
{
    let taken = statusToTaken[status];
    card = document.getElementById(cell);
    
    //let card ='<div class="card '+ status +'">'+
            //'<div class="card-body '+ status + '">'+
               //'<h5 class="card-title">' + title + ' (' + taken[0].toUpperCase() + taken.substring(1)  + ')</h5>'+
               // '<p class="card-text ' + status +'">' + text + '</p>'+
           // '</div>'+
       // '</div>';
}

function emptyCard()
{
    let card ='<div class="card">'+
            '<div class="card-body incomplete">'+
                '<h5 class="card-title"></h5>'+
                '<p class="card-text incomplete" style = "height=50px;"> </p>'+
            '</div>'+
        '</div>';
    return card;
}

function setUpCards()
{
    for(let title in titleAndText)
    {
        createCard(title, titleAndText[title], titleAndStatus[title], cellNumber[title]);
    }
}

let titleAndText =
{
    "Researching MagicVoid (M)" : "",
    "Missing People (S, C)" : "The repersenative of Lago has been gone for quite some time, vanishing without a trace. He has been gone for over a week, the townspeople are worried something might have happened. A couple of other townspeople are missing as well. Talk to barkeep Mal, to learn more. Reward: 30 gold.",
    "Nightly Attacks (S)" : "Lake View has been under attack from a MagicVoid monster. After the hunting parties return at night, the monster breaks into the walls. It kills a couple of people till the guards are able to make it retreat. We have not been able to kill it, we don't have enough food without hunting. Please help us, talk to Glaso City repersentiative. Reward: 50 gold & weird crystal."
};

/**
 * complete Means the quest was taken, incomplete means it wasn't
 */
let titleAndStatus =
{
    "Researching MagicVoid (M)" : "incomplete",
    "Missing People (S, C)" : "incomplete",
    "Nightly Attacks (S)" : "incomplete"
};

let cellNumber =
{
    "Researching MagicVoid (M)" : "qBCell2",
    "Missing People (S, C)" : "qBCell3",
    "Nightly Attacks (S)" : "qBCell1"
};

let statusToTaken =
{
    "complete" : "Taken",
    "incomplete" : "Not Taken"
};

init();