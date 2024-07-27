"use strict";

export function toTitleCase(word)
{
    let finalWord = "";
    if(word.includes(" "))
    {
        word = word.split(" ");
        for(let singleWord of word)
        {
            finalWord += `${singleWord[0].toUpperCase() + singleWord.slice(1)} `;
        }
    }

    else
    {
        finalWord = word[0].toUpperCase() + word.slice(1);
    }

    return finalWord;
}

export function createCard(title, text, location)
{
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card .bg-UP-blue notes");
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body notes");
    let cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerHTML = title;
    cardBody.appendChild(cardTitle);
    for(let i = 0; i < text.length; i++)
    {
        let cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        cardText.style.margin = "3px";
        cardText.innerHTML = text[i];
        cardBody.appendChild(cardText);
    }
    
    let noteDisplay = document.getElementById(location);
    noteDisplay.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
}