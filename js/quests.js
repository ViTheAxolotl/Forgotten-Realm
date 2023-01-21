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
    "Learning Powers" : "Fight some Growth in the forest to learn new powers.",
    "Releasing Ceremony" : "Go to ceremony and release your inner feelings to the world.",
    "Missing Shipments" : "Find the pirates and the shipments. Return shipments back to the Quadrant 4.",
    "Meet Up With Quadrand 2's Recruits" : "Since Quadrant 2's base burned down to the ground, the recruits are coming to Sal's base. Current mission is to meet up with them, then come up with a game plan.",
    "Find Max & Avenge Ja" : "Max is missing after finding Ja dead on the floor. Find Max and avenge Ja.",
    "Growth On Maynor Border" : "The Growth has been moving closer to Maynor since the festival. Maynor is defenseless since it has no Galno base set up. Help defeat Growth before they reach the town.",
    "Missing Kid" : "A worried mom has tried to reach out to the guards to find her missing kid, but the guards are too busy to help her. The kid has been missing for a few days, the mom knows the last whereabouts of her kid.",
    "Stolen Artifact" : "A merchant's family heirloom was stolen during the ceremony. The merchant owns an antique shop in town."
};

let titleAndStatus =
{
    "Learning Powers" : "complete",
    "Releasing Ceremony" : "complete",
    "Missing Shipments" : "complete",
    "Meet Up With Quadrand 2's Recruits" : "incomplete",
    "Find Max & Avenge Ja" : "incomplete",
    "Growth On Maynor Border " : "incomplete",
    "Missing Kid" : "incomplete",
    "Stolen Artifact" : "incomplete"
};

setUpCards();