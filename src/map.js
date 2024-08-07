"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase } from './../js/viMethods.js';
 
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

let auth = getAuth();
let database = getDatabase();

const currentMapRef = ref(database, 'currentMap/');
onValue(currentMapRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeDB = data;
    addTokens();
});

const charRef = ref(database, 'playerChar/');
onValue(charRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeChar = data;
});

const currentTORef = ref(database, 'currentTO/');
onValue(currentTORef, (snapshot) => 
{
    const data = snapshot.val();
    wholeTO = data;
    removeTurnOrder(); 
    setTurnOrder();
});

const summonsRef = ref(database, 'playerChar/Vi/summons');
onValue(summonsRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeSummons = data;
    isSummonOn = wholeSummons["isSummonOn"];
});

let wholeDB = {};
let div = document.getElementById("gridMap");
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
let currentHp = document.getElementById("current");
let maxHp = document.getElementById("max");
let tempHp = document.getElementById("temp");
let titleTxt = document.getElementById("title");
let offSet;
let divTO = document.getElementById("turnOrder");
let wholeTO;
let wholeSummons;
let isSummonOn;
let player;
let wholeChar;
let firstRun = true;
let currentTurn;
let players = ["nibbly", "nook", "razor", "leonier"];

onAuthStateChanged(auth, (user) => 
{
    if (!user) 
    {
        alert("You need to login before using this resource. Click Ok and be redirected");
        window.location.href = "loginPage.html?map.html"; 
    } 

    else
    {
        player = auth.currentUser.email.split("@");
        player = toTitleCase(player[0]);
    }
});

function init()
{
    setInterval(timer, 100);
    
    if(rect.width < 999)
    {
        mapSize = rect.width;
        bumper = 0; //was 9
        distance = mapSize / 14; //Math.round(mapSize / 14);
        movement = distance - 6; // - 4
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
    fetch('https://vitheaxolotl.github.io/Forgotten-Realm/src/files.json').then(res => res.json()).then((json) => imgs = json);
    document.getElementById("hideCover").onclick = hideCover;
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

    if(player == "Vi")
    {
        if(isSummonOn && !(Object.keys(wholeDB).includes("sky")) && wholeSummons["sky"] != undefined)
        {
            set(ref(database, "currentMap/sky"), wholeSummons["sky"]);
        }
    }

    if(!(Object.keys(wholeDB).includes(wholeChar[player]["token"]["id"])))
    {
        set(ref(database, `currentMap/${wholeChar[player]["token"]["id"]}`), wholeChar[player]["token"]);

        if(isSummonOn)
        {
            for(let key of Object.keys(wholeSummons))
            {
                if(key != "isSummonOn" && key != "summonPreset")
                {
                    let user = wholeSummons[key]["title"].replaceAll(" ", "").slice(wholeSummons[key]["title"].indexOf(":") + 1).split(",");
                    user = toTitleCase(user[0]);

                    if(wholeChar[player]["charName"] == user)
                    {
                        set(ref(database, `currentMap/${wholeSummons[key]["id"]}`), wholeSummons[key]);
                    }
                }
            }
        }

        set(ref(database, `playerChar/${player}/currentToken`, wholeChar[player]["token"]["id"]));
        location.reload();
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
        char[2].src = getHpImg(character);
        char[2].id = "hp";
        char[2].classList = `tokens ${character["id"]} hp`;
        let x = pos[0];
        let y = pos[0];
        
        if(!character["title"].includes("Hidden"))
        {
            char[1].title = `${toTitleCase(character["id"])}:${character["title"]}`;
        }

        if(wholeChar[player]["currentToken"] == character["id"])
        {
            if(currentHp.value == "" && maxHp.value == "" && title.innerHTML == "Status: ")
            {
                currentHp.defaultValue = character["currentHp"];
                maxHp.defaultValue = character["maxHp"];
                tempHp.defaultValue = character["tempHp"];
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

            if(title.includes("Opac"))
            {
                let opacityStart = title.indexOf("Opac") + 4;
                let opac = title.slice(opacityStart, opacityStart + 2);

                for(let image of char)
                {
                    image.style.opacity = `.${opac}`;
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

            if(title.includes("Invisible"))
            {
                if(wholeChar[player]["token"]["id"] != character["id"])
                {
                    for(let image of char)
                    {
                        image.src = "images/map/tokens/invisible-.png";
                    }
                }

                else
                {
                    char.push(document.createElement("img"));
                    char[3].src = `images/map/tokens/pInvisable.png`;
                    char[3].id = "tempInvis";
                    char[3].classList = `tokens ${character["id"]} tempInvis`;
                    char[3].onclick = handleCharClick;
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

        for(let i = 0; i < char.length; i++)
        {
            char[i].onclick = handleCharClick;
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
    let tempHp = character["tempHp"];

    let fraction = parseInt(currentHp) / parseInt(maxHp);

    if(tempHp > 0)
    {
        return "images/map/hpBar/tempHp.png";
    }

    else if(maxHp == "0" && currentHp == "0")
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
    let name = titleTxt.innerHTML.replaceAll(" ", "").slice(titleTxt.innerHTML.indexOf(":") + 1).split(",");
    let compName = this.title.replaceAll(" ", "").slice(this.title.indexOf(":") + 1).split(",")

    if(wholeChar[player]["currentToken"] == this.classList[1])
    {
        handleViewTokens(this);
    }

    else if(player == "Vi")
    {
        set(ref(database, `playerChar/${player}/currentToken`), this.classList[1]);
        location.reload();
    }

    else if(name.includes(compName[0]) && compName[0] != "")
    {
        set(ref(database, `playerChar/${player}/currentToken`), this.classList[1]);
        location.reload();
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
        const currentTokens = document.getElementsByClassName(wholeChar[player]["currentToken"]);
        let char = document.getElementById(wholeChar[player]["currentToken"]);
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
                    n = "sky-dragon";
                }
                break;
            
            case "sky-dragon":
                if(!(t.includes("Sky-dragon")))
                {
                    n = "sky-";
                }
                break;
        }

        set(ref(database, `currentMap/${char.id}`),
        {
            border : borderColor,
            currentHp : currentHp.value,
            maxHp : maxHp.value,
            tempHp : tempHp.value,
            map : "",
            isSummon : wholeDB[char.id]["isSummon"],
            id : char.id,
            name : n,
            title : t,
            xPos : x,
            yPos : y
        });

        if(wholeChar[player]["currentToken"] == wholeChar[player]["token"]["id"])
        {
            set(ref(database, `playerChar/${player}/token`),
            {
                border : borderColor,
                currentHp : currentHp.value,
                maxHp : maxHp.value,
                tempHp : tempHp.value,
                map : "",
                isSummon : false,
                id : char.id,
                name : n,
                title : t,
                xPos : x,
                yPos : y
            });
        }

        else if(isSummonOn)
        {
            if(wholeDB[char.id]["isSummon"])
            {
                if(currentHp.value == "0")
                {
                    set(ref(database, `playerChar/Vi/summons/${char.id}`), null);
                }

                else
                {
                    set(ref(database, `playerChar/Vi/summons/${char.id}`),
                    {
                        border : borderColor,
                        currentHp : currentHp.value,
                        maxHp : maxHp.value,
                        tempHp : tempHp.value,
                        map : "",
                        isSummon : wholeDB[char.id]["isSummon"],
                        id : char.id,
                        name : n,
                        title : t,
                        xPos : x,
                        yPos : y
                    });
                }
            }
        }
    } 
    
    catch (e) 
    {
        alert("Error adding document: ", e);
    }
}

init();