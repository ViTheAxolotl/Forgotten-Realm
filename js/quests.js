"use strict";

function createCard(title, text, status)
{
    document.write
    (
        '<div class="card '+ status +'">'+
            '<div class="card-body '+ status + '">'+
                '<h5 class="card-title">' + title + ' (' + status[0].toUpperCase() + status.substring(1)  + ')</h5>'+
                '<p class="card-text ' + status +'">' + text + '</p>'+
            '</div>'+
        '</div>'
    );
}

function setUpCards()
{
    for(let title in titleAndText)
    {
        createCard(title, titleAndText[title], titleAndStatus[title]);
    }
}

let titleAndText =
{
    "Reach Dull Knife's Bar" : "After getting the acceptance letter, you are asked go to the town of Silver Tooth to meeth with Prince Grado.",
    "Reach Kingdom of Salatude" : "After reaching Dull Knife, you are ready for the escort to the Castle. What dangers will great you?",
    "Find the Murderer" : "The lights went out, and panic sat in. Now there are dead bodies, someone in the ball killed them, find out who and bring them to the Prince."
};

let titleAndStatus =
{
    "Reach Dull Knife's Bar" : "complete",
    "Reach Kingdom of Salatude" : "complete",
    "Find the Murderer" : "incomplete"
};

setUpCards();