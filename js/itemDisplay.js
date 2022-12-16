"use strict";
function init()
{
    let buttons = document.getElementsByTagName("button");
    
    buttons[buttons.length - 3].onclick = handleSearch;
    buttons[buttons.length - 2].onclick = handleBringToTop;
    buttons[buttons.length - 1].onclick = handleReset;
}

function handleSearch()
{
    let txtBox = document.getElementById("searchTxt");
    let display = document.getElementById("description");
    let image = document.getElementById("itemImg");
    display.innerHTML = items[txtBox.value];
    image.src = img[txtBox.value];
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

let items = 
{
    "KeTS1Ss" : "Gen 1. The True-Self key is also known as the mind key, for its mental powers. When inserted into anything and twisted to the left, this key will reveal the true self of the being/object. All shapeshifting or other non-natural effects will vanish. This ability is most known to stop Monster Key’s powers and return the person to their normal state of being. When you twist this key to the right, a door will appear. This door leads to the person’s mind, and the self-conscious of the person will appear next to the body of the person. The person is paralyzed and controls the self-conscious. You will be able to open the door, see memories and the mindscape of the person, and alter it as you seem fit.",
    "KeMR2Mi" : ""
};

let img =
{
    "KeTS1Ss" : "images/keys/TSKey.png"
};