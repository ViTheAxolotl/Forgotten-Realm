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
    let nameTxt = document.getElementById("name");
    txtBox.innerHTML = charStories[this.id];
    image.setAttribute("class", "visible")
    image.src = charImg[this.id];
    nameTxt.innerHTML = [this.id];
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
    "Zherus" : "",
    "Ja" : "Ja is Max's dog, he loves head pats. He is a very good boy, everyone in Galno treasures him. (Currently Deceased)",
    "Max" : "Max is the leader of Darin's Galno branch. His dog is the only family he has left, he would do anything for it. Max has the power to teleport to anyone by focusing on an item they held dear.",
    "Sal" : "Sal is the representative of Kasie's islands branch of Galno. He is able to see invisible things including powers and their strength. He can also get a basic description of the things he touches. He has the Knife of Star Magic, the blade that can destroy magic and free the powers within. Every Representative has one of these extremely rare knives.",
    "Uni" : "Uni is a private investigator, he works with local businesses and Galno. He has the power to see people's fears when he touches them. He uses his powers to get the answers he needs. The cops are currently tracking him down for his torture charges.",
    "Mira" : "Mira use to be Quadrant 2’s Galno Leader, till tragedy befell the Representative. The Representative’s body was never found, it was thought she died in combat in the mines. Mira took over the job since she was already trained by the representative. Mira has the power to change and manipulate the sound she produces. She can through her voice up to 110ft away. She uses her sound as a weapon by booming it.",
    "Uny" : "Uny's parents were killed in an accident on Quadrant 2 factory floor. Uny was only 10 when she became an orphan. She when from house to house, and no one wanted to keep her. She would experiment with tech, causing a bunch of explosions. It go so bad that no one wanted her, till the orphanage found out she had a half-brother. They reached out to him, Uni finding out he had a sister, came and picked her up. Uny was used to the bouncing around and expected Uni to give up on her as well. One day, Sal came over to talk to Uni, seeing Uny he became intrigued. He offered to unlock her powers, to give her the ability to make her own life. Uny having nothing to lose agreed. She found out she has the power to talk to the tech, her inventions helped create the ideas she had. She made enough money to live on her own, she decided to become a pirate. So she can protect people and those who are thrown around the system."
};

let charImg = 
{
    "Talon" : "images/characters/Talon.jpg",
    "Kaylin" : "images/characters/Kaylin.jpg",
    "Lyla" : "images/characters/Lyla.jpg",
    "Zherus" : "images/characters/Zherus.jpg",
    "Ja" : "images/npcs/Ja.jpg",
    "Max" : "images/npcs/Max.jpg",
    "Sal" : "images/npcs/Sal.PNG",
    "Uni" : "images/npcs/Uni.jpg",
    "Mira" : "images/npcs/Mira.jpg",
    "Uny" : "images/npcs/Uny.jpg"
}
