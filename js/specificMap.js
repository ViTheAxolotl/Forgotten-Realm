"use strict";

function init()
{
    let titles = document.getElementsByClassName("mapTitle");
    let img = document.getElementById("mapSource");
    let htmlInfo = window.location.href;
    let mapName = "";

    htmlInfo = htmlInfo.split("?");
    mapName = htmlInfo[1];
    
    titles.forEach(title =>
    {
        title.innerHTML = mapName;
    });

    img.src = mapImg[mapName];
}

let mapImg = 
{
    "Havenport" : "../images/maps/mapOfHavenport.png",
    "Salatude" : "../images/maps/mapOfSalatude.png"
};

init();