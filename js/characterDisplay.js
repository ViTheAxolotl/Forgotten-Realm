"use strict";
function init()
{
    let characters = document.getElementsByTagName("button");

    for (let i = 1; i < characters.length - 1; i++) 
    {
        characters[i].onclick = handleCharacterButton;
    }

    characters[characters.length - 2].onclick = handleBringToTop;
    characters[characters.length - 1].onclick = handleReset;
}

function handleCharacterButton()
{
    let txtBox = document.getElementById("description");
    let image = document.getElementById("charImg");
    txtBox.innerHTML = charStories[this.id];
    image.src = charImg[this.id];
    document.getElementById("display").scrollIntoView({behavior: 'smooth'});
}

function handleBringToTop()
{
    document.getElementById("header").scrollIntoView({behavior: 'smooth'});
}

function handleReset()
{
    location.reload(true);
}

window.onload = init;

let charStories = 
{
    "Talon" : "",
    "Kaylin" : "",
    "Lyla" : "",
    "Ja" : "Ja is Max's dog, he loves head pats. He is a very good boy, everyone in Galno treasures him. (Currently Deceased)",
    "Max" : "Max is the leader of Darin's Galno branch. His dog is the only family he has left, he would do anything for it. Max has the power to teleport to anyone by focusing on an item they held dear.",
    "Sal" : "Sal is the representative of Kasie's islands branch of Galno. He is able to see invisible things including powers and their strength. He can also get a basic description of the things he touches. He has the Knife of Star Magic, the blade that can destroy magic and free the powers within. Every Representative has one of these extremely rare knives.",
    "Uni" : "Uni is a private investigator, he works with local businesses and Galno. He has the power to see people's fears when he touches them. He uses his powers to get the answers he needs. The cops are currently tracking him down for his torture charges."
};

let charImg = 
{
    "Talon" : "images/characters/Talon.jpg",
    "Kaylin" : "images/characters/Kaylin.jpg",
    "Lyla" : "images/characters/Lyla.jpg",
    "Ja" : "images/npcs/Ja.jpg",
    "Max" : "images/npcs/Max.jpg",
    "Sal" : "images/npcs/Sal.PNG",
    "Uni" : "images/npcs/Uni.jpg"
}
