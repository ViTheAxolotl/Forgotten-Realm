"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const firebaseApp = initializeApp
({
    apiKey: "AIzaSyArcsmJkXSeuIHMysYtIzRdjIDlKNQA25Y",
    authDomain: "forgottenrealmsmap.firebaseapp.com",
    projectId: "forgottenrealmsmap",
    storageBucket: "forgottenrealmsmap.appspot.com",
    messagingSenderId: "697902154695",
    appId: "1:697902154695:web:ffa5c47817f3097c89cfe2",
    measurementId: "G-Q2W494NRDT"
});

let database = getDatabase();
const currentMapRef = ref(database, 'currentMap/');
onValue(currentMapRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeDB = data;
    addTokens();
});

const currentTORef = ref(database, 'currentTO/');
onValue(currentTORef, (snapshot) => 
{
    const data = snapshot.val();
    wholeTO = data;
    removeTurnOrder(); 
    setTurnOrder();
});

let wholeDB = {};
let div = document.getElementById("gridMap");
let htmlInfo = window.location.href;
let html = {};
const gridMap = document.querySelector("#gridMap");
const rect = gridMap.getBoundingClientRect();
let mapSize;
let bumper;
let distance;
let movement;
let pos; 
let yPos;
let xPos;
let tokens = [];
let imgs;
let currentHp;
let maxHp;
let titleTxt;
let offSet;
let divTO;
let wholeTO;
let currentTurn;
let players = ["nibbly", "nook", "razor", "leonier"];

function init()
{
    setMainVaribles();
    setInterval(timer, 100);
}

function setMainVaribles()
{   
    fetch('https://vitheaxolotl.github.io/Forgotten-Realm/src/files.json').then(res => res.json()).then((json) => imgs = json);
    htmlInfo = htmlInfo.split("?");
    htmlInfo = htmlInfo[1];
    htmlInfo = htmlInfo.split("_");
    html[htmlInfo[0]] = {"border" : htmlInfo[1], "name" : htmlInfo[0], title : " "};
    document.getElementById("hideCover").onclick = hideCover;

    if(rect.width < 999)
    {
        mapSize = rect.width;
        bumper = 9;
        distance = Math.round(mapSize / 14);
        movement = distance - 4;
    }

    else
    {
        mapSize = (rect.width * (8 / 10));
        bumper = Math.round(rect.width / 10) + 2;
        distance = Math.round(mapSize / 14);
        movement = distance - 6;
    }

    let disAndBum = distance + bumper;
    pos = [disAndBum, disAndBum + movement, disAndBum + (movement * 2), disAndBum + (movement * 3), disAndBum + (movement * 4), disAndBum + (movement * 5), disAndBum + (movement * 6), disAndBum + (movement * 7), disAndBum + (movement * 8), disAndBum + (movement * 9), disAndBum + (movement * 10), disAndBum + (movement * 11), disAndBum + (movement * 12)];
    yPos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
    xPos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

    currentHp = document.getElementById("current");
    maxHp = document.getElementById("max");
    titleTxt = document.getElementById("title");
    divTO = document.getElementById("turnOrder");
}

function addTokens()
{
    if(div.children.length > 1)
    {
        let loop = true;
        while(loop)
        {
            try 
            {
                if(div.children.length > 1)
                {
                    if(!(div.children[1].classList.contains("update")))
                    {
                        div.removeChild(div.children[1]);
                    } 

                    else
                    {
                        if(!(div.lastChild.classList.contains("update")))
                        {
                            div.removeChild(div.lastChild);
                        }

                        else
                        {
                            loop = false;
                            break;
                        }
                    }
                }

                else
                {
                    loop = false;
                    break;
                }
            } 
            
            catch (error) 
            {
                loop = false;
                break;
            }
        }
    }

    for(let key of Object.keys(wholeDB))
    {
        addCharacter(wholeDB[key], false);
    }

    if(!(Object.keys(wholeDB).includes(htmlInfo[0].replace("-", ""))))
    {
        let htmlChar = html[htmlInfo[0]];
        let token = document.getElementById(htmlChar["name"]);
        let x = parseInt(token.style.left.replace("px", ""));
        let y = parseInt(token.style.top.replace("px", ""));
        x = xPos[pos.indexOf(x)];
        y = yPos[pos.indexOf(y)];
        let t = document.getElementById("title");
        t = t.innerHTML.slice(t.innerHTML.indexOf(" "));

        set(ref(database, `currentMap/${htmlChar["name"].slice(0, htmlChar["name"].indexOf("-"))}`),
        {
            border : htmlChar["border"],
            currentHp : document.getElementById("current").value,
            maxHp : document.getElementById("max").value,
            map : "",
            id : htmlChar["name"].slice(0, htmlChar["name"].indexOf("-")),
            name : htmlChar["name"],
            title : t,
            xPos : x,
            yPos : y
        });
    }
}

function makeToken(key, turn, charPos)
{
    let row = [document.createElement("div"), document.createElement("h6"), document.createElement("h6")];
    let names = ["div", "Position", "Name"];

    for(let i = 0; i < 3; i++)
    {
        row[i].id = `${key}-${names[i]}`;
        row[i].style.margin = "5px";

        if(i != 0)
        {
            row[0].appendChild(row[i]); 
            row[i].style.display = "inline";
            row[i].classList.add("color-UP-yellow");
        }
    }

    if(turn == "true"){row[0].classList.add("selected"); currentTurn = charPos;}

    row[1].innerHTML = `${charPos}`;
    row[2].innerHTML = `| ${key}`;
    divTO.appendChild(row[0]);
}

function removeTurnOrder()
{
    let loop = true;
    
    while(loop)
    {
        if(divTO.children.length > 0)
        {
            divTO.removeChild(divTO.children[0]);
        }
        
        else
        {
            loop = false;
        }
    }
}

function setTurnOrder()
{
    for(let i = 1; i <= Object.keys(wholeTO).length; i++)
    {
        for(let key of Object.keys(wholeTO))
        {
            if(i == wholeTO[key].position)
            {
                makeToken(wholeTO[key].charName, wholeTO[key].selected, wholeTO[key].position);
                break;
            }
        }
    }
}

function addCharacter(character, update)
{
    //if(document.getElementsByClassName(character["id"]).length == 0)
    //{
        let char = [document.createElement("img"), document.createElement("img"), document.createElement("img")];
        char[0].src = `images/map/tokens/${character["name"]}.png`;
        char[0].id = character["id"];
        char[0].classList = `tokens ${character["id"]} char`;
        char[1].src = `images/map/tokens/${character["border"]}Border.png`;
        char[1].id = character["border"];
        char[1].classList = `tokens ${character["id"]} border_`;
        char[1].onclick = handleCharClick;
        char[2].src = getHpImg(character);
        char[2].id = "hp";
        char[2].classList = `tokens ${character["id"]} hp`;
        let x = pos[0];
        let y = pos[0];
        
        if(!character["title"].includes("Hidden"))
        {
            char[1].title = `${character["id"].charAt(0).toUpperCase() + character["id"].slice(1)}:${character["title"]}`;
        }

        if(htmlInfo[0] == character["id"])
        {
            if(currentHp.value == "" && maxHp.value == "" && title.innerHTML == "Status: ")
            {
                currentHp.defaultValue = character["currentHp"];
                maxHp.defaultValue = character["maxHp"];
                document.getElementById("title").innerHTML += character["title"];
            }
        }

        if(character.title != "")
        {
            let title = character.title;
            x = pos[xPos.indexOf(character["xPos"])];
            y = pos[yPos.indexOf(character["yPos"])];

            if(char[0].id == "invisible")
            {
                document.getElementById("grid").src = imgs["mapName"][character.map];
            }

            if(title.includes("Large"))
            {
                setupExp(2, char, "x");
                setupExp(2, char, "y");
            }

            else if(title.includes("Huge"))
            {
                setupExp(3, char, "x");
                setupExp(3, char, "y");
            }

            else if(title.includes("Gargantuan"))
            {
                setupExp(4, char, "x");
                setupExp(4, char, "y");
            }

            if(title.includes("Top"))
            {
                for(let image of char)
                {
                    if(image.style.zIndex == "")
                    {
                        image.style.zIndex = 400;
                    }

                    else
                    {
                        image.style.zIndex = `${parseInt(image.style.zIndex) + 300}`;
                    }
                }
            }

            else if(title.includes("Bottom"))
            {
                for(let image of char)
                {
                    if(image.style.zIndex == "")
                    {
                        image.style.zIndex = 20;
                    }

                    else
                    {
                        image.style.zIndex = `${parseInt(image.style.zIndex) - 50}`;
                    }
                }
            }

            if(title.includes("90"))
            {
                for(let image of char)
                {
                    image.style.transform = 'rotate(90deg)';
                }
            }

            else if(title.includes("180"))
            {
                for(let image of char)
                {
                    image.style.transform = 'rotate(180deg)';
                }
            }

            else if(title.includes("270"))
            {
                for(let image of char)
                {
                    image.style.transform = 'rotate(270deg)';
                }
            }

            if(title.includes("FlipX"))
            {
                for(let image of char)
                {
                    image.style.transform += 'scaleX(-1)';
                } 
            }

            if(title.includes("FlipY"))
            {
                for(let image of char)
                {
                    image.style.transform += 'scaleY(-1)';
                } 
            }

            if(title.includes("Hidden"))
            {
                for(let image of char)
                {
                    image.src = "images/map/tokens/invisible-.png";
                }
            }

            if(title.includes("Dup x"))
            {
                dup("x", char, character, [x, y], title);
            }

            if(title.includes("Dup y"))
            {
                dup("y", char, character, [x, y], title);
            }

            if(title.includes("Exp x")) 
            {   
                exp("x", title, char);             
            }

            if(title.includes("Exp y")) 
            {
                exp("y", title, char);
            }

            char[0].title = `${character["title"]}`;
        }

        for(let i = 0; i < 3; i++)
        {
            placeTokens(x, y, char[i]);
            
            if(update)
            {
                char[i].classList.add("update");
            }

            div.appendChild(char[i]);
        }
    //}
}

function exp(xOrY, title, char)
{
    let expNum;

    if(xOrY == "x"){expNum = title.slice(title.indexOf("Exp x"));}
    else{expNum = title.slice(title.indexOf("Exp y"));}

    if(expNum[5] != ",")
    {
        if(expNum[6] != ",")
        {
            setupExp(expNum[5] + expNum[6], char, xOrY);
        }

        else
        {
            setupExp(expNum[5], char, xOrY);
        }
    }

    else
    {
        setupExp(12, char, xOrY);
    }
}

function setupExp(num, char, xOrY)
{
    let size = (pos[num] - pos[0]) + "px";

    if(xOrY == "x")
    {
        for(let image of char)
        {
            image.style.width = size;
        }
    }
    
    else
    {
        for(let image of char)
        {
            image.style.height = size;
        }
    }
}

function dup(xOrY, char, character, locations, title)
{
    let num;
    let dupNum;
    let rotate = "0";

    if(xOrY == "x"){dupNum = title.slice(title.indexOf("Dup x"));}
    else{dupNum = title.slice(title.indexOf("Dup y"));}
    if(title.includes("90")){rotate = "90";}
    else if(title.includes("180")){rotate = "180";}
    else if(title.includes("270")){rotate = "270";}

    if(dupNum[5] != ",")
    {
        if(dupNum[6] != ",")
        {
            num = parseInt(dupNum[5] + dupNum[6]);
        }

        else
        {
            num = parseInt(dupNum[5]);
        }
    }

    else
    {
        num = 12
    }

    if(xOrY == "x"){offSet = xPos.indexOf(character["xPos"]);}
    else{offSet = yPos.indexOf(character["yPos"]);}

    for(let i = 0; i < num; i++){setupDup(char, character, xOrY, locations, rotate)}
}

function setupDup(char, character, xOrY, locations, rotate)
{
    let stuffs = [document.createElement("img"), document.createElement("img"), document.createElement("img")];
    offSet++;

    for(let d = 0; d < 3; d++)
    {
        stuffs[d].classList.add("tokens");
        stuffs[d].src = char[d].src;
        stuffs[d].style.zIndex = char[d].style.zIndex;
        stuffs[d].style.transform = `rotate(${rotate}deg)`;
        stuffs[d].classList.add(character["id"]);
        
        if(xOrY == "x"){placeTokens(pos[offSet], locations[1], stuffs[d]);}
        else{placeTokens(locations[0], pos[offSet], stuffs[d]);}
        
        switch(d)
        {
            case 0:
            {
                stuffs[d].classList.add("char");
                break;
            }

            case 1:
                stuffs[d].classList.add("border_");
                break;

            case 2:
                stuffs[d].classList.add("hp");
                break;
        }

        div.appendChild(stuffs[d]);
    }
}


function getHpImg(character)
{
    let maxHp = character["maxHp"];
    let currentHp = character["currentHp"];

    let fraction = parseInt(currentHp) / parseInt(maxHp);

    if(maxHp == "0" && currentHp == "0")
    {
        return "images/map/hpBar/invisible.png";
    }

    else if(fraction == 1)
    {
        return "images/map/hpBar/hpBar1.png";
    }

    else if(fraction >= .8)
    {
        return "images/map/hpBar/hpBar2.png";
    }

    else if(fraction >= .6)
    {
        return "images/map/hpBar/hpBar3.png";
    }

    else if(fraction >= .4)
    {
        return "images/map/hpBar/hpBar4.png";
    }

    else if(fraction > 0)
    {
        return "images/map/hpBar/hpBar5.png";
    }

    else if(fraction == 0)
    {
        return "images/map/hpBar/hpBar6.png";
    }  
}

function handleCharClick()
{
    let name = titleTxt.innerHTML.split(" ");
    let compName = this.title.replace(" ", "").split(":");

    if(htmlInfo[2] == "vi")
    {
        let charToken = document.getElementById(this.classList[1]);
        window.location.href= `map.html?${charToken.id}_${this.id}_vi`;
    }

    else if(name.includes(compName[1]))
    {
        let charToken = document.getElementById(this.classList[1]);
        window.location.href= `map.html?${charToken.id}_${this.id}_x`;
    }

    else
    {
        handleViewTokens(this);
    }
}

function handleViewTokens(t)
{
    let currentToken = document.getElementsByClassName(t.classList[1]);
    let viewDiv = document.getElementById("cover");
    let i = 0;
    let y = 2;
    let title;

    viewDiv.classList = "";
    viewDiv.style.zIndex = "1011";
    for(let elm of viewDiv.children)
    {
        elm.classList = elm.classList[1];
        elm.style.zIndex = `101${y}`;
        y++;

        if(elm.src != undefined)
        {
            elm.src = currentToken[i].src;
            elm.title = currentToken[i].title;
            if(elm.title.includes(":"))
            {
                title = elm.title;
            }
            
            i++;
        }

        else if(elm.id == "viewTitle")
        {
            elm.innerHTML = title;
        }
    }
}

function hideCover()
{
    let viewDiv = document.getElementById("cover");

    for(let elm of viewDiv.children)
    {
        elm.classList = `invisible ${elm.classList[0]}`;
        elm.style.zIndex = "0";
    }

    viewDiv.classList = `invisible`;
    viewDiv.style.zIndex = "0";
}

function placeTokens(x, y, prop)
{
    prop.style.left = x + "px";
    prop.style.top = y + "px";
}

function timer()
{
    checkUpdates();
}

function checkUpdates()
{
    tokens = [];

    for(let name of Object.keys(wholeDB))
    {
        let token = document.getElementById(name);
        if(token != null)
        {
            if(token.classList.contains("update"))
            {
                updateToken(token);
            }

            tokens.push(token);
        }
    }
}

function updateToken(token)
{
    try 
    {
        let x;
        let y;
        let t = document.getElementById("title");
        t = t.innerHTML.slice(t.innerHTML.indexOf(" "));
        const currentTokens = document.getElementsByClassName(htmlInfo[0]);
        let char = document.getElementById(htmlInfo[0]);
        let borderColor;
        let n = char.id + '-';

        if(/\d/.test(char.id))
        {
            n = char.id.replace(/\d/g, '') + '-';
        }
//!Object.keys(wholeDB).includes(token.id) && 
        for(let token of currentTokens)
        {
            if(token.classList.contains("border_"))
            {
                borderColor = token.id;
            }

            token.classList.remove("update");
        }

        x = parseInt(char.style.left.replace("px", ""));
        y = parseInt(char.style.top.replace("px", ""));
        x = xPos[pos.indexOf(x)];
        y = yPos[pos.indexOf(y)];

        switch(char.id)
        {
            case "sky":
                if(t.includes("Sky-dragon"))
                {
                    char.id = "sky-dragon";
                    setInterval(() => {window.location.href= `map.html?${char.id}_${borderColor}_x`;}, 2000);
                }
                break;
            
            case "sky-dragon":
                if(!(t.includes("Sky-dragon")))
                {
                    char.id = "sky-";
                    setInterval(() => {window.location.href= `map.html?${char.id}_${borderColor}_x`;}, 2000);
                }
                break;
        }

        set(ref(database, `currentMap/${char.id}`),
        {
            border : borderColor,
            currentHp : document.getElementById("current").value,
            maxHp : document.getElementById("max").value,
            map : "",
            id : char.id,
            name : n,
            title : t,
            xPos : x,
            yPos : y
        });
    } 
    
    catch (e) 
    {
        console.error("Error adding document: ", e);
    }
}

init();