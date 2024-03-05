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
    "Find the Murderer" : "The lights went out, and panic sat in. Now there are dead bodies, someone in the ball killed them, find out who and bring them to the Prince.",
    "Missing People (S)" : "The representative of Lago has been gone for quite some time, vanishing without a trace. He has been gone for over a week, the townspeople are worried something might have happened. A couple of other townspeople are missing as well. Talk to barkeep Mal, to learn more. Reward: 30 gold.",
    "Nightly Attacks (S)" : "Lake View has been under attack by a MagicVoid monster. After the hunting parties return at night, the monster breaks into the walls. It kills a couple of people till the guards are able to make it retreat. We have not been able to kill it, we don't have enough food without hunting. Please help us, talk to the Lake View representative. Reward: 50 gold & weird crystal.",
    "Finding the Petty Theif (S)" : "In Lake View peoples prized possesions have been stolen. The party is tasked to find the theif since the guards are still recoving from the MagicVoid. After gettign the items, they will recieve, 4 prenium tickets, free meal at Tiger's Pub, and a total of 36 gold. All clues point to a lady with red hair, a blue cloak with grey flowers on the trim, and puke green shoes. The party has found a spot she eats and hangs out at.",
    "Researching MagicVoid (M)" : "The head scientist of Castle Havenport has found some less hostile MagicVoid. He wants to do some research to understand the properties of MagicVoid, however, he is not equipt to fight them if they attack. He asks for some escorts and protectors, so he can find a way to stop MagicVoid from taking over the world. Reward: 45 gold & information.",
};

let titleAndStatus =
{
    "Find the Murderer" : "complete",
    "Nightly Attacks (S)" : "complete",
    "Finding the Petty Theif (S)" : "incomplete",
    "Missing People (S)" : "incomplete",
    " Researching MagicVoid (M)" : "incomplete"
};

setUpCards();