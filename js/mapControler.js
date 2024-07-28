"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, createCard } from './viMethods.js';

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
const currentTORef = ref(database, 'currentTO/');
onValue(currentTORef, (snapshot) => 
{
    const data = snapshot.val();
    wholeTO = data;
});

const charRef = ref(database, 'playerChar/');
onValue(charRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeChar = data;

    if(firstRun)
    {
        firstRun = false;
        init();
    }
});

let favoriteRef;

onAuthStateChanged(auth, (user) => 
{
    if (user) 
    {
        player = auth.currentUser.email.split("@");
        player = toTitleCase(player[0]);
    } 
});

const gridMap = document.querySelector("#gridMap");
const rect = gridMap.getBoundingClientRect();
let mapSize;
let bumper;
let distance;
let movement;
let bounds;
let currentPos;
let currentCharacter;
let playerName = document.getElementById("name");
let key;
let keyControl;
let arrows = [];
let currentHp = document.getElementById("current");
let maxHp = document.getElementById("max");
let tempHp = document.getElementById("temp");
let buttons;
let player;
let pos;
let firstRun = true;
let div = document.getElementById("grid");
let currentBorders = document.getElementsByClassName("border_");
let firstMenu;
let secondMenu;
let spellBtn;
let rollDiceBtn;
let wholeTO = {};
let wholeChar = {};
let wholeFavorite = {};
let wholeSpells;
let currentLv = "5th level";
let spellLevel;
let curClass;
let searchBar = document.getElementsByName("search");
let favorite = false;
let db;

function init()
{
    arrows.push(document.getElementById("up"));
    arrows.push(document.getElementById("left"));
    arrows.push(document.getElementById("right"));
    arrows.push(document.getElementById("down"));
    
    fetch('https://vitheaxolotl.github.io/Forgotten-Realm/src/spells.json').then(res => res.json()).then((json) => wholeSpells = json);
    
    currentHp.onchange = updateHp;
    maxHp.onchange = addUpdate;
    tempHp.onchange = tempHpUpdate;
    searchBar[0].onchange = handleSearch;

    for(let arrow of arrows)
    {
        arrow.onclick = handleArrow;
        arrow.touchstart = handleArrow;
    }

    document.addEventListener("keydown", (ev) => {key = ev.key.slice(ev.key.indexOf("w") + 1).toLowerCase(); keyControl = ev; let keyValues = ["left", "right", "down", "up"]; if(keyValues.includes(key) && ev.ctrlKey) {handleArrow();}});
    setMainVaribles();
}

function setMainVaribles()
{   
    buttons = document.getElementsByClassName("inOrDe");
    playerName.innerHTML = toTitleCase(wholeChar[player]["currentToken"]);
    currentCharacter = document.getElementsByClassName(wholeChar[player]["currentToken"]);
    let hiddenVi = document.getElementsByClassName("isVi");
    firstMenu = document.getElementsByClassName("firstMenu");
    for(let fButton of firstMenu){fButton.onclick = handleChangeFirstDisplay;}
    secondMenu = document.getElementsByClassName("secondMenu");
    for(let sButton of secondMenu){sButton.onclick = handleChangeSecondDisplay;}
    spellBtn = document.getElementsByClassName("spell");
    for(let sButton of spellBtn){sButton.onclick = handleShowSpells;}
    rollDiceBtn = document.getElementById("rollDice").onclick = handleDiceRoll;

    if(player != "Vi")
    {
        for(let elem of hiddenVi)
        {
            elem.style.display = "none";
        }
    }

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
    bounds = [pos[0], pos[12]];

    for(let button of buttons)
    {
        if(button.innerHTML == "+")
        {
            button.onclick = increaseValue;
        }

        else
        {
            button.onclick = decreaseValue;
        }
    }
}

function sendDiscordMessage(message)
{
    let webhook = wholeChar["Vi"]["testingWebhook"];
    const contents = `${message}`;
    const request = new XMLHttpRequest();
    request.open("POST", webhook);
    request.setRequestHeader("Content-type", "application/json");
    const prams = 
    {
        content: contents
    }
    request.send(JSON.stringify(prams));
}

function basicRoll(amount, dice)
{
    let arr = [];
    let rolls = [];
    for(let i = 1; i < dice + 1; i++){arr.push(i);}

    for(let i = 0; i < amount; i++)
    {
        let roll = arr[(Math.floor(Math.random() * arr.length))];
        rolls.push(roll);
    }

    return rolls;
}

function diceRoller(amount, dice, modifier)
{
    let rolls = basicRoll(amount, dice);
    let sum = 0;
    let viewMod = modifier;
    if(modifier >= 0){viewMod = "+" + modifier;}
    let message = `${wholeChar[player]["discordName"]} ${player} rolled \`${amount}d${dice}${viewMod}\`: \`(`;
    
    for(let roll of rolls)
    {
        sum += roll;
        message += `${roll}+`;
    }

    if(message[message.length-1] == "+")
    {
        message = message.slice(0, message.length - 1);
    }
    
    let finalResult = sum + modifier;
    message += `)${viewMod}=${finalResult}\``;

    return message;
}

function handleDiceRoll()
{
    let amount = parseInt(document.getElementById("diceToRoll").value);
    let dice = parseInt(document.getElementById("sides").value);
    let modifier = parseInt(document.getElementById("modifier").value);
    
    if(amount != "" && dice != "" && modifier != "")
    {
        sendDiscordMessage(diceRoller(amount, dice, modifier));
    }

    else{alert("Need input in all 3 spaces.");}
}

function handleChangeFirstDisplay()
{
    if(!this.classList.contains("Selected"))
    {
        for(let fButton of firstMenu)
        {
            let prop;
            favorite = false;

            if(this.name != fButton.name)
            {
                prop = document.getElementById(fButton.name);
                prop.style.display = "none";
                
                if(fButton.classList.contains("selected"))
                {
                    fButton.classList.remove("selected");
                }
            }

            else
            {
                prop = document.getElementById(this.name);
                prop.style.display = "block";
                this.classList.add("selected");
            }
        }

        if(this.name == "favorites")
        {
            favorite = true;
            favoriteRef = ref(database, `playerChar/${player}/favorites/`);
            onValue(favoriteRef, (snapshot) => 
            {
                const data = snapshot.val();
                wholeFavorite = data;

                let spellDiv = document.getElementById("spellsF")
                while(spellDiv.children.length > 0)
                {
                    spellDiv.removeChild(spellDiv.lastChild);
                }

                for(let i = 0; i < wholeFavorite["spells"].length; i++)
                {
                    let lvlBtn = document.createElement("button");
                    lvlBtn.name = i;
                    lvlBtn.classList = "gridButton spell";
                    lvlBtn.innerHTML = `Lvl ${i}`;
                    if(i == 0){lvlBtn.innerHTML = "Cantrips";}
                    lvlBtn.onclick = handleShowSpells;
                    spellDiv.appendChild(lvlBtn);
                }
            });
        }
    }
}

function handleChangeSecondDisplay()
{
    if(!this.classList.contains("Selected"))
    {
        for(let sButton of secondMenu)
        {
            let prop;

            if(this.name != sButton.name)
            {
                prop = document.getElementById(sButton.name);
                prop.style.display = "none";
                
                if(sButton.classList.contains("selected"))
                {
                    sButton.classList.remove("selected");
                }
            }

            else
            {
                prop = document.getElementById(this.name);
                prop.style.display = "block";
                this.classList.add("selected");
            }
        }
    }
}

function tempHpUpdate()
{
    let tHp = parseInt(tempHp.value);
    
    if(tHp < 0)
    {
        tempHp.value = "0";
    }

    addUpdate();
}

function increaseValue()
{
    let cHp = parseInt(currentHp.value);
    let mHp = parseInt(maxHp.value);
    let tHp = parseInt(tempHp.value);

    if(this.name == "current")
    {
        if(!(cHp + 1 > mHp))
        {
            currentHp.value = `${cHp + 1}`;
        }
    } 

    else if(this.name == "max")
    {
        maxHp.value = `${mHp + 1}`;
    }

    else if(this.name == "temp")
    {
        tempHp.value = `${tHp + 1}`;
    }

    else if(this.name == "title")
    {
        let title = document.getElementById("title");
        let status = document.getElementById("status");

        title.innerHTML += ` ${toTitleCase(status.value)},`;
    }

    else if(this.name == "turn")
    {
        handleChangeInTurn("up");
        return;
    }

    for(let prop of currentCharacter)
    {
        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }
}

function decreaseValue()
{
    let cHp = parseInt(currentHp.value);
    let mHp = parseInt(maxHp.value);
    let tHp = parseInt(tempHp.value);

    if(this.name == "current")
    {
        if(!(cHp - 1 < 0))
        {
            currentHp.value = `${cHp - 1}`;
        }
    } 
    
    else if(this.name == "max")
    {
        if(!(mHp - 1 < cHp))
        {
            maxHp.value = `${mHp - 1}`;
        }
    }

    else if(this.name == "temp")
    {
        if(tHp > 0)
        {
            tempHp.value = `${tHp - 1}`;
        }
    }

    else if(this.name == "title")
    {
        let title = document.getElementById("title");
        let status = document.getElementById("status");

        title.innerHTML = title.innerHTML.replace(` ${toTitleCase(status.value)},`, "");
    }

    else if(this.name == "turn")
    {
        handleChangeInTurn("down");
        return;
    }

    for(let prop of currentCharacter)
    {
        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }
}

function changeTOValue(data, sit)
{
    let sel = "false";
    
    if(sit == "set")
    {
        sel = "true";
    }

    set(ref(database, `currentTO/${data.charName}`),
    {
        charName : data.charName,
        position : data.position,
        selected : sel
    });
}

function handleChangeInTurn(dirrection)
{
    let curSelected;
    let newSelected;
    let newPosition;

    for(let key of Object.keys(wholeTO))
    {
        if(wholeTO[key].selected == "true")
        {
            curSelected = key;
            break;
        }
    }

    if(dirrection == "up")
    {
        if(wholeTO[curSelected].position == Object.keys(wholeTO).length){newPosition = "1";}
        else{newPosition = `${parseInt(wholeTO[curSelected].position) + 1}`}
    }
        
    else if(dirrection == "down")
    {
        if(wholeTO[curSelected].position == "1"){newPosition = `${Object.keys(wholeTO).length}`;}
        else{newPosition = `${parseInt(wholeTO[curSelected].position) - 1}`}
    }

    for(let key of Object.keys(wholeTO))
    {
        if(dirrection == "up" && wholeTO[key].position == newPosition){newSelected = key; break;}
        else if(dirrection == "down" && wholeTO[key].position == newPosition){newSelected = key; break;}
    }

    document.getElementById(`${curSelected}-div`).classList.remove("selected");
    document.getElementById(`${newSelected}-div`).classList.add("selected");

    changeTOValue(wholeTO[curSelected], "unset");
    changeTOValue(wholeTO[newSelected], "set");
}

function moveChar(xPos, yPos)
{
    for(let prop of currentCharacter)
    {
        prop.style.left = xPos + "px";
        prop.style.top = yPos + "px";
        prop.classList += " update";
    }   
}

function addUpdate()
{
    for(let prop of currentCharacter)
    {
        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }
}

function updateHp()
{
    let hpImg;

    for(let prop of currentCharacter)
    {
        if(prop.classList.contains("hp"))
        {
            hpImg = prop;
        }

        if(!(prop.classList.contains("update")))
        {
            prop.classList += " update";
        }
    }

    if(parseInt(this.value) > parseInt(maxHp))
    {
        this.value = maxHp;
    }

    let fraction = parseInt(this.value) / parseInt(maxHp);

    if(fraction == 1)
    {
        hpImg.src = "images/map/hpBar/hpBar1.png";
    }

    else if(fraction >= .8)
    {
        hpImg.src = "images/map/hpBar/hpBar2.png";
    }

    else if(fraction >= .6)
    {
        hpImg.src = "images/map/hpBar/hpBar3.png";
    }

    else if(fraction >= .4)
    {
        hpImg.src = "images/map/hpBar/hpBar4.png";
    }

    else if(fraction >= .2)
    {
        hpImg.src = "images/map/hpBar/hpBar5.png";
    }

    else if(fraction == 0)
    {
        hpImg.src = "images/map/hpBar/hpBar6.png";
    }  
}

function handleArrow()
{
    let dirrection = "";
    currentPos = [parseInt(currentCharacter[0].style.left.replace("px", "")), parseInt(currentCharacter[0].style.top.replace("px", ""))];

    for(let token of currentCharacter)
    {
        let title = token.title;
        if(title != undefined)
        {
            if(title.includes("Large"))
            {
                bounds = [pos[0], pos[11]];
                break;
            }

            else if(title.includes("Huge"))
            {
                bounds = [pos[0], pos[10]];
                break;
            }

            else if (title.includes("Gargantuan"))
            {
                bounds = [pos[0], pos[9]];
                break;
            }

            else
            {
                bounds = [pos[0], pos[12]];
            }
        }
    }

    if(key != undefined)
    {
        keyControl.preventDefault();
        dirrection = key;
    }

    if (this != undefined)
    {
        dirrection = this.id;
    }

    if(dirrection == "up")
    {
        if(bounds[0] < currentPos[1])
        {
            moveChar(currentPos[0], currentPos[1] - movement);
        }   
    }

    else if (dirrection == "left")
    {
        if(bounds[0] < currentPos[0])
        {
            moveChar(currentPos[0] - movement, currentPos[1]);
        }
    }

    else if (dirrection == "down")
    {
        if(bounds[1] > currentPos[1])
        {
            moveChar(currentPos[0], currentPos[1] + movement);
        }       
    }

    else if (dirrection == "right")
    {
        if(bounds[1] > currentPos[0])
        {
            moveChar(currentPos[0] + movement, currentPos[1]);
        } 
    }
}

function handleShowSpells()
{
    spellLevel = this.name;
    curClass = undefined;
    db = wholeSpells;
    if(favorite){db = wholeFavorite["spells"];}
    let spells = db[spellLevel];
    let upper = document.getElementById("cards");
    
    for(let spell of spellBtn)
    {
        if(spell.classList.contains("selected"))
        {
            spell.classList.remove("selected");
        }
    }

    this.classList.add("selected");

    while(upper.children.length > 0)
    {
        upper.removeChild(upper.lastChild);
    }

    if(searchBar[0].value != "")
    {
        handleSearch();
    }

    else
    {
        document.getElementById("searchDiv").style.display = "block";

        for(let spell of Object.keys(spells))
        {
            createCard(spell, setUpText(spell, spells), "cards");
        }

        for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;}
    }
}

function setUpText(spell, spells)
{
    let txt = [`Casting Time: ${toTitleCase(spells[spell]["castTime"])}`, `Range: ${toTitleCase(spells[spell]["range"])},`, `Components: ${spells[spell]["components"]}`, `Duration: ${toTitleCase(spells[spell]["duration"])}`];
    if(spells[spell]["concentration"] == "true"){txt.push(`Concentration`);}
    txt.push(`${spells[spell]["description"]}`);
    txt.push("");
    return txt;
}

function handleSearch()
{
    let search = searchBar[0].value;
    
    if(spellLevel)
    {
        let spells = db[spellLevel];
        let upper = document.getElementById("cards");

        while(upper.children.length > 0)
        {
            upper.removeChild(upper.lastChild);
        }
    
        for(let spell of Object.keys(spells))
        {
            if(spell.toLowerCase().includes(search.toLowerCase()))
            {
                createCard(spell, setUpText(spell, spells), "cards");
            }
        }

        for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;}
    }
}

function handleCardClick()
{
    let children = this.childNodes;
    let currentTitle = children[0].innerHTML;
    let spellDisc = children[1].innerHTML;

    if(spellLevel)
    {
        let favoriteBtn = document.createElement("img");
        favoriteBtn.setAttribute("id", "favoriteBtn");
        favoriteBtn.onclick = handleFavoriteBtn;
        favoriteBtn.classList.add(currentTitle.replace(" ", "_"));
        
        if(wholeChar[player]["favorites"]["spells"])
        {
            if(wholeChar[player]["favorites"]["spells"][spellLevel][currentTitle])
            {
                favoriteBtn.setAttribute("src", "images/favorited.png");
            }
        }

        else
        {
            favoriteBtn.setAttribute("src", "images/unFavorite.png");
        }

        this.parentElement.appendChild(favoriteBtn);

        if(spellDisc.includes("spell slot"))
        {
            let scale = children[children.length - 1].slice(children[children.length - 1].indexOf("@scaledamage"), children[children.length - 1].indexOf("}"));
            let individual = scale.split(" ");
            individual = individual[1].split("|");
            let slotSelect = document.createElement("select");
            slotSelect.name = "upcast";
            slotSelect.id = individual[0] + "|" + individual[2];

            for(let i = parseInt(spellLevel); i < 10; i++)
            {
                let option = document.createElement("option");
                let suff = ["st", "nd", "rd", "th"];
                if(i > 3){suff = suff[3];}
                else{suff = suff[i - 1];}
                option.value = individual[0];
                if(i > parseInt(spellLevel))
                {
                    let inisal = individual[0].split("d");
                    let multiplier = individual[2].split("d");
                    let total = parseInt(inisal[0]) + parseInt(multiplier[0]) * (i - parseInt(spellLevel));
                    option.value = `${total}d${inisal[1]}`;
                }
                option.text = `${i}${suff} Level Slot (${option.value})`;
                slotSelect.appendChild(option);
            }

            this.parentElement.appendChild(slotSelect);
        }

        if(favorite) //let edit
        {

        }

        let castBtn = document.createElement("button");
        castBtn.classList.add("gridButton");
        castBtn.onclick = castSpell;
        castBtn.innerHTML = "Cast Spell";
        castBtn.name = currentTitle;
        this.parentElement.appendChild(castBtn);
    }
}

function castSpell()
{

}

function handleFavoriteBtn()
{
    let spellName = this.classList[0].replace("_", " ");

    if(this.src.includes("images/unFavorite.png")) //Add to favrites
    {
        this.src = "images/favorited.png";
        set(ref(database, `playerChar/${player}/favorites/spells/${spellLevel}/${spellName}`), wholeSpells[spellLevel][spellName]);
    }

    else //Remove from favorites
    {
        this.src = "images/unFavorite.png";
        set(ref(database, `playerChar/${player}/favorites/spells/${spellLevel}/${spellName}`), null);
    }
}