"use strict";

function init()
{
    let titles = document.getElementsByClassName("mapTitle");
    let img = document.getElementById("mapSource");
    let htmlInfo = window.location.href;
    let mapName = "";

    htmlInfo = htmlInfo.split("?");
    mapName = htmlInfo[1];
    
    for(let i = 0; i < titles.length; i++)
    {
        titles[i].innerHTML = "Map of " + mapName;
    }

    img.src = mapImg[mapName];
}

let mapImg = 
{
    "Havenport" : "images/maps/mapOfHavenport.png",
    "CastleHavenport" : "images/maps/mapOfCastleHavenport.png",
    "Salatude" : "images/maps/mapOfSalatude.png"
};

init();