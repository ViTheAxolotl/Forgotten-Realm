"use strict";

let div = document.getElementById("story");
let characters = ["nook", "nibbly", "leonier", "razor"];
let borders = ["blue", "golden", "green", "grey", "orange", "pink", "purple", "red"];
let char = document.createElement("h3");
let bord = document.createElement("h3");
let go = document.createElement("button");
char.innerHTML = "Select Character";
char.classList = "blo";
bord.innerHTML = "Select Boarder";
bord.classList = "blo";
go.innerHTML = "Go!";
go.classList = "blo";
go.onclick = handleGoButton;

for(let i = 0; i < 4; i++)
{
    let name = characters[i];
    characters[i] = document.createElement("img");
    characters[i].src = `images/map/tokens/${name}.png`;
    characters[i].id = name;
    characters[i].onclick = select;
}

for(let i = 0; i < 8; i++)
{
    let color = borders[i];
    borders[i] = document.createElement("img");
    borders[i].src = `images/map/tokens/${color}Border.png`;
    borders[i].id = color;
    borders[i].onclick = select;
}

function init()
{
    div.appendChild(char);
    for(let character of characters)
    {
        div.appendChild(character);
    }

    div.appendChild(bord);
    for(let border of borders)
    {
        div.appendChild(border);
    }

    div.appendChild(go);
}

function select()
{
    if(characters.includes(this))
    {
        for(let i = 0; i < 4; i++)
        {
            characters[i].classList = "q";
        }

        this.classList = "selected";
    }

    else if(borders.includes(this))
    {
        for(let i = 0; i < 8; i++)
        {
            borders[i].classList = "q";
        }

        this.classList = "selected";
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
