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
    "Meet Up With Quadrand 2's Recruits" : "Since Quadrant 2's base burned down to the ground, the recruits are coming to Sal's base. Current mission is to meet up with them, then come up with a game plan.",
    "Missing Kid" : "A worried mom has tried to reach out to the guards to find her missing kid, but the guards are too busy to help her. The kid has been missing for a few days, the mom knows the last whereabouts of her kid.",
    "Stolen Artifact" : "A merchant's family heirloom was stolen during the ceremony. The merchant owns an antique shop in town.",
    "Find Max & Avenge Ja" : "Max is missing after finding Ja dead on the floor. Find Max and avenge Ja.",
    "Growth On Maynor Border" : "The Growth has been moving closer to Maynor since the festival. Maynor is defenseless since it has no Galno base set up. Help defeat Growth before they reach the town.",
    "Help Maxion" : "Maxion believes their is a key that can counter act the Monster Key. They believe it is on SunStar island, go there and help them get the key.",
    "Stolen Artifact Pt. 2" : "After fighting the Sea Growth, the Boat's Master told the party that the 2 green teenagers went to Smil with the box. Now that the party has a boat, they can head to Maun, the place the robbers are suspected to go.",
    "Missing Villagers" : "7 Villages have been reported missing, the poster is trying to raise awarness of the dangers in the swamps. But there seems to be more to this then that. The 7 names are listed, the barkeep says they visited frequently. Ask around town to build a profile on the case.",
    "Jumping the Fence" : "A Growth has been jumping the fence during the night and destroying the port. During the day it stays in the swamp. Reward is 30 gold, the head of the Growth needs to be given to Steve the border guard."
};

let titleAndStatus =
{
    "Meet Up With Quadrand 2's Recruits" : "complete",
    "Missing Kid" : "complete",
    "Stolen Artifact" : "complete",
    "Find Max & Avenge Ja" : "incomplete",
    "Growth On Maynor Border" : "incomplete",
    "Help Maxion" : "incomplete",
    "Stolen Artifact Pt. 2" : "incomplete",
    "Missing Villagers" : "incomplete",
    "Jumping the Fence" : "incomplete"
};

setUpCards();