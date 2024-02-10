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
    "Nook" : "",
    "Nibbly" : "",
    "Leonier" : "",
    "Razor" : "",
    "Jac'U" : "Jac'U is the girl who interviewed and put up the flier for the escort job. Jac'U has always worked with the royal family, she is well-liked in the console. She is also a Foreign Relations expert, she can speak many of Zaydia's languages fluently. She spends most of her time learning about other places and their culture. She has friends from all over.",
    "Grado" : "Grado is the prince of Havenport, the only child of the king. Grado tries his best to serve his kingdom in any way he can. He created the Clean Food & Water Act to help those who can't afford food. He helped open homeless centers in each of his towns. Many people don't like him, they hate that their tax money goes to the freeloaders. Multiple assassin attacks happened in recent years, causing Grado to have to be more careful. He still tries to be wild and have fun, even with some moles in his castle.",
    "Thallos" : "Prince Thallos is one of the wildest royals. Could it be his Succubus ways or the fact that he is the only one of his family 'left'? Thallos has his dads and his sister, however they are all MIA. King Alm went to go find his husband and daughter, leaving Thallos as the only one in charge of Salatude. It has been over 40 years since King Alm's disappearance, however, Thallos has not taken on the king's role. In his words, 'Where is the fun in that, I don't want to be one of those boring rulers. My Kingdom is prospering with me as the ruler, prince or king, doesn't matter.'",
    "Haven" : "Haven is the person who messagers go to. He takes all the letters and info and distributes it to the right people. Haven is also in charge of the mail throughout Castle Havenport. He has the office space next to him to store mail until his associates take it. He spends most of his time sorting mail by importance and category. He was raised by his father, and when his father passed he took over the family business in the castle. The party will need to talk with him to sign up for the quest, he will get the final say on all quest-related matters.",
    "Laura" : "Laura is the residential/housing lead, not much is known about her. She seems to be close with some of the guards. Even though she doesn't get paid much, she lives in the biggest house and takes many vacations. Something feels off about her, but you can't quite place your finger on it.",
    "Mal" : "Mal is the Bar/Innkeep of Lago. He cares for each of his patrons, not only for their gold. He listens to all their woes, and he tries to confert them. By doing this he doesn't only have loyal customers, but he learns what is happening around town. If you need any information, Mal is where you should start.",
    "Skinin" : "Skinin is an assassin for hire.",
    "Cliven" : "Cliven is the mayor of Lake View, she is also a part time college student at Stavin University. She spends most of her time reading and learning about magic/magical objects. She is the best friend of the Royal Scientist, she tries to help him with what she can. Her people look up to her and aspire to be just like her.",
    "Howard" : "Howard is the mad scientist of Castle Havenport, he uses what he finds to help anyone he can. His great-great grandpa was one of the people King Alm brought from Main to help his kingdom grow and advance. Howard's family has been loyal to the king ever since, but when he vainished, Howard found other employment. Working for Castle Havenport."
};

let charImg = 
{
    "Nook" : "images/characters/Nook.jpg",
    "Nibbly" : "images/characters/Nibbly.png",
    "Leonier" : "images/characters/Leonier.png",
    "Jac'U" : "images/npcs/Jac'U.jpg",
    "Grado" : "images/npcs/Grado.jpeg",
    "Thallos" : "images/npcs/princeThallos.PNG",
    "Haven" : "images/npcs/questGiverHaven.PNG",
    "Laura" : "images/npcs/resLaura.PNG",
    "Mal" : "images/npcs/barkeepMal.PNG",
    "Skinin" : "images/npcs/skinin.png",
    "Cliven" : "images/npcs/mayorCliven.PNG",
    "Howard" : "images/npcs/madHoward.PNG"
}
