"use strict";
let enter = document.getElementById("enter");
let charName = document.getElementById("name");
let currentName;
let div = document.getElementById("story");
let characters = ["nook", "nibbly", "leonier", "razor"];
let borders = ["blue", "golden", "green", "grey", "orange", "pink", "purple", "red"];
let char = document.createElement("h3");
let bord = document.createElement("h3");
let go = document.createElement("button");
let nooks = ["nook"];
let leoniers = ["leonier"];
let nibblys = ["nibbly"];
let razors = ["razor"];

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
        case "nook":
            for(let char of nooks)
            {
                let nook = document.createElement("img");
                nook.id = char;
                nook.src = `images/map/tokens/${char}.png`;
                nook.classList = "char";
                nook.onclick = select;
                div.appendChild(nook);
            }
            break;

        case "leonier":
            for(let char of leoniers)
            {
                let nook = document.createElement("img");
                nook.id = char;
                nook.src = `images/map/tokens/${char}.png`;
                nook.classList = "char";
                nook.onclick = select;
                div.appendChild(nook);
            }
            break;

        case "razor":
            for(let char of razors)
            {
                let nook = document.createElement("img");
                nook.id = char;
                nook.src = `images/map/tokens/${char}.png`;
                nook.classList = "char";
                nook.onclick = select;
                div.appendChild(nook);
            }
            break;

        case "nibbly":
            for(let char of nibblys)
            {
                let nook = document.createElement("img");
                nook.id = char;
                nook.src = `images/map/tokens/${char}.png`;
                nook.classList = "char";
                nook.onclick = select;
                div.appendChild(nook);
            }
            break;
    }

    addBorders();
    div.appendChild(go);
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
