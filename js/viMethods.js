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