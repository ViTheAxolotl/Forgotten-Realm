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
    "Jac'U" : "Jac'U is the girl who interviewed and put up the flyer for the escort job. Jac'U has always worked with the royal family, she is well liked in the consol. She is also the Forgen Realtions expert, she can speak many of Zaydia's languages fluently. She spends most of her time learning about other places and their culture. She has friends from all over.",
    "Grado" : "Grado is the prince of Havenport, he is the only child to the king. Grado tries his best to serve his kingdom in any way he can. He created the Clean Food & Water act to help those who can't afford food. He helped open homeless centers in each of his towns. Many people don't like him, they hate that their tax money is going to the freeloaders. Multiple assassign attacks happened in the resent years, causing Grado to have to be more careful. He still tries to be wild and have a fun time, even with some moles in his castle."
};

let charImg = 
{
    "Nook" : "images/characters/Nook.jpg",
    "Nibbly" : "images/characters/Nibbly.png",
    "Jac'U" : "images/npcs/Jac'U.jpg",
    "Grado" : "images/npcs/Grado.jpeg"
}
