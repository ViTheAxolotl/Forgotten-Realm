"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, setDoc, getDocs, deleteDoc, doc, collection, query, where } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

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

const db = getFirestore(firebaseApp);
let wholeData = {};
let div = document.getElementById("gridMap");
let htmlInfo = window.location.href;
let html = {};
const gridMap = document.querySelector("#gridMap");
const rect = gridMap.getBoundingClientRect();
let mapSize;
let bumper;
let distance;
let movement;
let names = new Set();
let pos; 
let yPos;
let xPos;
let tokens = [];
let stage = 1;
let imgs;
let currentHp;
let maxHp;
let titleTxt;

function init()
{
    setMainVaribles();
    readTokens();
    
    setInterval(timer, 2000);
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
}

async function readTokens()
{
    wholeData = {};
    names = new Set();
    const q = query(collection(db, "currentMap"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        wholeData[doc.id] = doc.data();
        names.add(doc.data().name);
        if(doc.data().name == "invisible-")
        {
            document.getElementById("grid").src = imgs["mapName"][doc.data().map];
        }
    });

    addTokens();
}

async function addTokens()
{
    if(!(names.has(htmlInfo[0])))
    {
        let htmlChar = html[htmlInfo[0]];
        let token = document.getElementById(htmlChar["name"]);
        let x = parseInt(token.style.left.replace("px", ""));
        let y = parseInt(token.style.top.replace("px", ""));
        x = xPos[pos.indexOf(x)];
        y = yPos[pos.indexOf(y)];
        let t = document.getElementById("title");
        t = t.innerHTML.slice(t.innerHTML.indexOf(" "));

        const docRef = await setDoc(doc(db, "currentMap", htmlChar["name"].slice(0, htmlChar["name"].indexOf("-"))), 
        {
            border : htmlChar["border"],
            currentHp : document.getElementById("current").value,
            maxHp : document.getElementById("max").value,
            map : "",
            name : htmlChar["name"],
            title : t,
            xPos : x,
            yPos : y
        });

        names.add(htmlInfo[0]);
    }

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

    for(let key of Object.keys(wholeData))
    {
        addCharacter(wholeData[key], false);
    }

    if(!(names.has(htmlInfo[0])))
    {
        let htmlChar = html[htmlInfo[0]];
        let token = document.getElementById(htmlChar["name"]);
        let x = parseInt(token.style.left.replace("px", ""));
        let y = parseInt(token.style.top.replace("px", ""));
        x = xPos[pos.indexOf(x)];
        y = yPos[pos.indexOf(y)];
        let t = document.getElementById("title");
        t = t.innerHTML.slice(t.innerHTML.indexOf(" "));

        const docRef = await setDoc(doc(db, "currentMap", htmlChar["name"].slice(0, htmlChar["name"].indexOf("-"))), 
        {
            border : htmlChar["border"],
            currentHp : document.getElementById("current").value,
            maxHp : document.getElementById("max").value,
            map : "",
            name : htmlChar["name"],
            title : t,
            xPos : x,
            yPos : y
        });

        names.add(htmlInfo[0]);
    }
}

function addCharacter(character, update)
{
    if(document.getElementById(character["name"]) == null)
    {
        let letterRemover = htmlInfo[0].indexOf("-");
        let char = [document.createElement("img"), document.createElement("img"), document.createElement("img")];
        char[0].src = `images/map/tokens/${character["name"]}.png`;
        char[0].id = character["name"];
        char[0].classList = `tokens ${character["name"]} char`;
        char[1].src = `images/map/tokens/${character["border"]}Border.png`;
        char[1].id = character["border"];
        char[1].classList = `tokens ${character["name"]} border_`;
        char[1].onclick = handleCharClick;
        char[1].onmousedown = handleViewTokens;
        char[2].src = getHpImg(character);
        char[2].id = "hp";
        char[2].classList = `tokens ${character["name"]} hp`;
        char[2].title = `${character["currentHp"]} ${character["maxHp"]}`;
        let x = pos[0];
        let y = pos[0];
        
        if(!character["title"].includes("Hidden"))
        {
            char[1].title = `${character["name"].charAt(0).toUpperCase() + character["name"].slice(1, letterRemover)}:${character["title"]}`;
        }

        if(htmlInfo[0] == character["name"])
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

            if(title.includes("Large"))
            {
                for(let image of char)
                {
                    image.classList += " Large";
                }
            }

            else if(title.includes("Huge"))
            {
                for(let image of char)
                {
                    image.classList += " Huge";
                }
            }

            else if(title.includes("Gargantuan"))
            {
                for(let image of char)
                {
                    image.classList += " Gargantuan";
                }
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

            if(title.includes("Hidden"))
            {
                for(let image of char)
                {
                    image.src = "images/map/tokens/invisible-.png";
                }
            }

            if(title.includes("Dup x"))
            {
                for(let i = 0; i < 13; i++)
                {
                    let stuffs = [document.createElement("img"), document.createElement("img"), document.createElement("img")];

                    for(let d = 0; d < 3; d++)
                    {
                        stuffs[d].classList.add("tokens");
                        stuffs[d].src = char[d].src;
                        stuffs[d].classList.add(character["name"]);
                        placeTokens(pos[i], y, stuffs[d]);

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
            }

            else if(title.includes("Dup y"))
            {
                for(let i = 0; i < 13; i++)
                {
                    let stuffs = [document.createElement("img"), document.createElement("img"), document.createElement("img")];

                    for(let d = 0; d < 3; d++)
                    {
                        stuffs[d].classList.add("tokens");
                        stuffs[d].src = char[d].src;
                        stuffs[d].classList.add(character["name"]);
                        placeTokens(x, pos[i], stuffs[d]);

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
            }

            if(title.includes("Exp x")) //Do this later
            {
                
            }

            else if(title.includes("Exp y")) //Do this later
            {
                
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
    if(htmlInfo[2] == "vi")
    {
        let charToken = document.getElementById(this.classList[1]);
        window.location.href= `map.html?${charToken.id}_${this.id}_vi`;
    }
}

function handleViewTokens()
{
    if(htmlInfo[2] != "vi")
    {
        let currentToken = document.getElementsByClassName(this.classList[1]);
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
    if(stage == 1)
    {
        checkUpdates();
        stage = 2;
    }

    else if(stage == 2)
    {
        readTokens();
        stage = 1;
    }
}

function checkUpdates()
{
    tokens = [];

    for(let name of names)
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

async function updateToken(token)
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

        for(let token of currentTokens)
        {
            if(!names.has(token.id) && token.classList.contains("border_"))
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
            case "sky-":
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

        const docRef = await setDoc(doc(db, "currentMap", char.id.slice(0, char.id.indexOf("-"))), 
        {
            border : borderColor,
            currentHp : document.getElementById("current").value,
            maxHp : document.getElementById("max").value,
            map : "",
            name : char.id,
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
