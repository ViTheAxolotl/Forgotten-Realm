"use strict";
let enter = document.getElementById("enter");
let charName = document.getElementById("name");
let currentName;
let div = document.getElementById("story");
let characters = ["nook", "nibbly", "leonier", "razor", "axolotl"];
let borders = ["blue", "golden", "green", "grey", "orange", "pink", "purple", "red"];
let char = document.createElement("h3");
let bord = document.createElement("h3");
let go = document.createElement("button");
let people = [];
let numToLet = {0 : "", 1 : "a"};

function init()
{
    char.innerHTML = "Select Character";
    char.classList = "blo";
    bord.innerHTML = "Select Boarder";
    bord.classList = "blo";
    go.innerHTML = "Go!";
    go.classList = "blo";

    enter.onclick = handleEnterButton;
    go.onclick = handleGoButton;
}

function handleEnterButton()
{
    currentName = charName.value;
    currentName = currentName.toLowerCase();

    if(characters.includes(currentName))
    {
        setUpCharacters(currentName);
    }
}

function setUpCharacters(currentName)
{
    for(let elem of div.children)
    {
        elem.classList = "hide";
    }

    div.appendChild(char);

    switch(currentName)
    {
        case "axolotl":
            let mapLink = document.createElement("a");
            mapLink.innerHTML = "Map Link";
            mapLink.href = "map.html?invisible_invisible";
            mapLink.classList = "blo";
            let dmLink = document.createElement("a");
            dmLink.innerHTML = "DM Link";
            dmLink.href = "dmSite.html";
            mapLink.classList = "blo";
            div.appendChild(dmLink);
            div.appendChild(mapLink);
            break;

        case "nook":
            for(let i = 0; i < 2; i++)
            {
                people.push(currentName + numToLet[i]);
            }
            break;

        case "leonier":
            for(let i = 0; i < 2; i++)
            {
                people.push(currentName + numToLet[i]);
            }
            break;

        case "razor":
            for(let i = 0; i < 2; i++)
            {
                people.push(currentName + numToLet[i]);
            }
            break;

        case "nibbly":
            for(let i = 0; i < 2; i++)
            {
                people.push(currentName + numToLet[i]);
            }
            break;
    }

    if(currentName != "axolotl")
    {
        addCharacters();
        addBorders();
        div.appendChild(go);
    }
}

function addCharacters()
{
    for(let char of people)
    {
        let person = document.createElement("img");
        person.id = char;
        person.src = `images/map/tokens/${char}.png`;
        person.classList = "char";
        person.onclick = select;
        div.appendChild(person);
    }
}

function addBorders()
{
    for(let i = 0; i < 8; i++)
    {
        let color = borders[i];
        borders[i] = document.createElement("img");
        borders[i].src = `images/map/tokens/${color}Border.png`;
        borders[i].id = color;
        borders[i].classList = "bord";
        borders[i].onclick = select;
    }

    div.appendChild(bord);
    for(let border of borders)
    {
        div.appendChild(border);
    }
}

function select()
{
    let classL = this.classList.value;
    if(classL.includes("char"))
    {
        let chars = document.getElementsByClassName("char");
        for(let char of chars)
        {
            char.classList = "char"
        }

        this.classList = "char selected";
    }

    else if(classL.includes("bord"))
    {
        let bords = document.getElementsByClassName("bord");
        for(let bord of bords)
        {
            bord.classList = "bord";
        }
        
        this.classList = "bord selected";
    }
}

function handleGoButton()
{
    let currentSelected = document.getElementsByClassName("selected");
    if(currentSelected.length == 2)
    {
        let curBorder = currentSelected[1].id;
        let curCharacter = currentSelected[0].id;
        window.location.href= `map.html?${curCharacter}_${curBorder}`;
    }
}

init();
