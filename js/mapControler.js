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
let actionBtn;
let wholeTO = {};
let wholeChar = {};
let wholeFavorite = {};
let wholeSpells;
let wholeActions;
let currentLv = "5th level";
let profBonus = "3";
let spellLevel;
let curClass;
let searchBar = document.getElementsByName("search");
let upper = document.getElementById("cards");
let favorite = false;
let db;
let lastSpell;
let lastAbility;

function init()
{
    arrows.push(document.getElementById("up"));
    arrows.push(document.getElementById("left"));
    arrows.push(document.getElementById("right"));
    arrows.push(document.getElementById("down"));
    
    fetch('https://vitheaxolotl.github.io/Forgotten-Realm/src/spells.json').then(res => res.json()).then((json) => wholeSpells = json);
    fetch('https://vitheaxolotl.github.io/Forgotten-Realm/src/actions.json').then(res => res.json()).then((json) => wholeActions = json);

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
    actionBtn = document.getElementsByClassName("action");
    for(let aButton of actionBtn){aButton.onclick = handleShowActions;}
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
    message = message + "\n\n ||                ||";
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
    for(let i = 1; i < parseInt(dice) + 1; i++){arr.push(i);}

    for(let i = 0; i < amount; i++)
    {
        let roll = arr[(Math.floor(Math.random() * arr.length))];
        rolls.push(roll);
    }

    return rolls;
}

function diceRoller(amount, dice, modifier, ifName)
{
    let rolls = basicRoll(amount, dice);
    let sum = 0;
    let viewMod = modifier;
    if(modifier >= 0 && !viewMod.includes("+")){viewMod = "+" + modifier;}
    let message = ""; 
    if(ifName){message = `${player} rolled `;}
    message += `*${amount}d${dice}${viewMod}*: *(`;
    
    for(let roll of rolls)
    {
        sum += roll;
        message += `${roll}+`;
    }

    if(message[message.length-1] == "+")
    {
        message = message.slice(0, message.length - 1);
    }
    
    let finalResult = sum + parseInt(modifier);
    message += `)${viewMod}=* **${finalResult}**`;

    return message;
}

function handleDiceRoll()
{
    let amount = parseInt(document.getElementById("diceToRoll").value);
    let dice = parseInt(document.getElementById("sides").value);
    let modifier = parseInt(document.getElementById("modifier").value);
    
    if(amount != "" && dice != "" && modifier != "")
    {
        sendDiscordMessage(diceRoller(amount, dice, modifier, true));
    }

    else{alert("Need input in all 3 spaces.");}
}

function handleChangeFirstDisplay()
{
    if(!this.classList.contains("Selected"))
    {
        emptyCards();
        document.getElementById("searchDiv").style.display = "none";

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

                let actionDiv = document.getElementById("abilityF")
                while(actionDiv.children.length > 0)
                {
                    actionDiv.removeChild(actionDiv.lastChild);
                }

                spellDiv.classList.add("center");
                actionDiv.classList.add("center");
                
                if(wholeFavorite["spells"])
                {
                    for(let spellLv of Object.keys(wholeFavorite["spells"]))
                    {
                        let lvlBtn = document.createElement("button");
                        lvlBtn.name = spellLv;
                        lvlBtn.classList = "gridButton spell";
                        lvlBtn.innerHTML = `Lvl ${spellLv}`;
                        lvlBtn.onclick = handleShowSpells;
                        if(spellLv == "0"){lvlBtn.innerHTML = "Cantrips";}
                        else if(spellLv == "hold"){lvlBtn.innerHTML = "Create New Spell"; lvlBtn.onclick = handleCreateNew;}
                        spellDiv.appendChild(lvlBtn);
                    }
                }

                if(wholeFavorite["actions"])
                {
                    for(let actionTag of Object.keys(wholeFavorite["actions"]))
                    {
                        let tagBtn = document.createElement("button");
                        tagBtn.name = actionTag;
                        tagBtn.classList = "gridButton action";
                        tagBtn.innerHTML = `${actionTag}`;
                        tagBtn.onclick = handleShowActions;
                        if(actionTag == "hold"){tagBtn.innerHTML = "Create New Ability"; tagBtn.onclick = handleCreateNew;}
                        actionDiv.appendChild(tagBtn);
                    }
                }
            });
        }
    }
}

function handleChangeSecondDisplay()
{
    if(!this.classList.contains("Selected"))
    {
        emptyCards();

        spellLevel = undefined;
        curClass = undefined;
        document.getElementById("searchDiv").style.display = "block";

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

function emptyCards()
{
    while(upper.children.length > 0)
    {
        upper.removeChild(upper.lastChild);
    }
}

function handleShowSpells()
{
    spellLevel = this.name;
    curClass = undefined;
    db = wholeSpells;
    if(favorite){db = wholeFavorite["spells"];}
    let spells = db[spellLevel];
    
    for(let spell of spellBtn)
    {
        if(spell.classList.contains("selected"))
        {
            spell.classList.remove("selected");
        }
    }

    this.classList.add("selected");

    emptyCards()

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

function handleShowActions()
{
    spellLevel = undefined;
    curClass = this.name;
    db = wholeActions;
    if(favorite){db = wholeFavorite["actions"];}
    let actions = db[curClass];

    for(let action of actionBtn)
    {
        if(action.classList.contains("selected"))
        {
            action.classList.remove("selected");
        }
    }

    this.classList.add("selected");

    emptyCards()

    if(searchBar[0].value != "")
    {
        handleSearch();
    }

    else if(db[curClass].length == 0){}

    else
    {
        document.getElementById("searchDiv").style.display = "block";

        for(let action of Object.keys(actions))
        {
            createCard(action, setUpText(action, actions), "cards");
        }

        for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;}
    }
}

function setUpText(current, lst)
{
    let txt = [""];
    
    if(spellLevel)
    {
        txt = [`Casting Time: ${toTitleCase(lst[current]["castTime"])}`, `Range: ${toTitleCase(lst[current]["range"])}`, `Components: ${lst[current]["components"]}`, `Duration: ${toTitleCase(lst[current]["duration"])}`];
        if(lst[current]["concentration"] == "true"){txt.push(`Concentration`);}
        txt.push(" ");
    }

    let lineNum = txt.length - 1;
    let temp = JSON.stringify(lst[current]["description"]).replaceAll("\"", "").split("\\n");
    for(let t in temp)
    {
        if(temp[t].includes("{@Choice}"))
        {
            txt.push(temp[t].replace("{@Choice}", "<li>") + "</li>");
            lineNum++;
        }

        else
        {
            if(lineNum > 0 && txt[`${lineNum}`].includes("<li>"))
            {
                lineNum++;
                txt.push("");
            }

            txt[`${lineNum}`] = txt[`${lineNum}`] + ` ${temp[t]}`;
        }
    }
    
    
    return txt;
}

function handleSearch()
{
    let search = searchBar[0].value;
    let listOf;

    if(spellLevel)
    {
        listOf = db[spellLevel];
    }

    else
    {
        listOf = db[curClass];
    }

    emptyCards();
    
    for(let elm of Object.keys(listOf))
    {
        if(elm.toLowerCase().includes(search.toLowerCase()))
        {
            createCard(elm, setUpText(elm, listOf), "cards");
        }
    }

    for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;}
}

function handleCardClick()
{
    let children = this.childNodes;
    let currentTitle = children[0].innerHTML;
    
    let temp = document.getElementById("optionDiv");
    if(temp){temp.remove();}
    let favBtn = document.getElementById("favBtn");
    if(favBtn){favBtn.remove();}
    
    if(lastAbility != currentTitle && lastSpell != currentTitle)
    {
        let optionDiv = document.createElement("div");
        optionDiv.classList.add("center");
        optionDiv.id = "optionDiv";

        let favoriteBtn = document.createElement("img");
        favoriteBtn.setAttribute("id", "favoriteBtn");
        favoriteBtn.classList.add(currentTitle.replaceAll(" ", "_"));
        favoriteBtn.style.height = "20px";
        favoriteBtn.style.width = "20px";
        favoriteBtn.setAttribute("src", "images/unFavorite.png");
        let wrapper = document.createElement("button");
        wrapper.classList.add("gridButton");
        wrapper.classList.add("center");
        wrapper.onclick = handleFavoriteBtn;
        wrapper.id = "favBtn";
        wrapper.appendChild(favoriteBtn);

        let castBtn = document.createElement("button");
        castBtn.classList.add("gridButton");
        castBtn.onclick = handleUseAction;
        castBtn.innerHTML = "Cast Spell";
        castBtn.name = currentTitle;
        castBtn.style.margin = "0px 5px";

        if(spellLevel)
        {
            lastSpell = currentTitle;
            let spellDisc = db[spellLevel][currentTitle]["description"];
            if(favorite){spellDisc = wholeFavorite["spells"][spellLevel][currentTitle]["description"]}

            if(wholeChar[player]["favorites"]["spells"][spellLevel])
            {
                if(wholeChar[player]["favorites"]["spells"][spellLevel][currentTitle])
                {
                    favoriteBtn.setAttribute("src", "images/favorited.png");
                }
            }

            if(spellDisc.includes("spell slot") && spellDisc.includes("scaledamage"))
            {
                let scale = spellDisc.slice(spellDisc.indexOf("scaledamage"), spellDisc.indexOf("} for each slot"));
                let individual = scale.split(" ");
                individual = individual[1].split("|");
                let slotSelect = document.createElement("select");
                slotSelect.name = "upcast";
                slotSelect.id = individual[0] + "|" + individual[2];
                slotSelect.style.margin = "0px 5px";

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

                optionDiv.appendChild(slotSelect);
            }
        }

        else
        {
            lastAbility = currentTitle;
            let abilityDisc = db[curClass][currentTitle]["description"];
            if(favorite){abilityDisc = wholeFavorite["actions"][curClass][currentTitle]["description"];}

            if(wholeChar[player]["favorites"]["actions"][curClass])
            {
                if(wholeChar[player]["favorites"]["actions"][curClass][currentTitle])
                {
                    favoriteBtn.setAttribute("src", "images/favorited.png");
                }
            }

            if(abilityDisc.includes("{@absorb}"))
            {
                let dice = 4;
                let lvlSelect = document.createElement("select");
                lvlSelect.name = "upcast";
                lvlSelect.style.margin = "0px 5px";

                for(let i = 1; i < 10; i++)
                {
                    let option = document.createElement("option");
                    let suff = ["st", "nd", "rd", "th"];
                    if(i > 3){suff = suff[3];}
                    else{suff = suff[i - 1];}

                    option.value = `1d${dice}`;
                    dice = dice + 2;
                    option.text = `${i}${suff} Level Slot (1 on ${option.value})`;
                    lvlSelect.appendChild(option);
                }

                optionDiv.appendChild(lvlSelect);
            }

            castBtn.innerHTML = "Use Ability";
        }

        if(favorite) 
        {
            let edit = document.createElement("button");
            edit.classList.add("gridButton");
            edit.onclick = handleEditCard;
            edit.innerHTML = "Edit";
            edit.name = currentTitle;
            edit.style.margin = "0px 5px";
            optionDiv.appendChild(edit);
        }

        optionDiv.appendChild(castBtn);
        this.parentNode.appendChild(wrapper);
        this.parentNode.parentNode.insertBefore(optionDiv, this.parentNode.nextSibling);
    }

    else
    {
        lastSpell = "";
        lastAbility = "";
    }
}

function handleUseAction()
{
    let display;
    let useInfo;
    let damage;
    let discription;
    let upcast = document.getElementsByName("upcast");
    let listOf;
    let lastUse;

    if(spellLevel){listOf = db[spellLevel]; lastUse = lastSpell;}
    else{listOf = db[curClass]; lastUse = lastAbility;}

    discription = listOf[lastUse]["description"];
    
    useInfo = setUpText(lastUse, listOf);
    useInfo = useInfo.join("\n");

    if(upcast[0])
    {
        if(discription.includes("{@damage")){discription += `{@sDice ${upcast[0].value}}`;}
        else if(discription.includes("{@scaledamage")){discription = `{@damage ${upcast[0].value}}`;}
        else if(discription.includes("{@absorb")){discription = `{@sDice ${upcast[0].value}}`}
    }

    if(discription.includes("{@"))
    {
        if(discription.includes("{@save")) 
        {
            let skill = "unknown";
            let toBeat = spellOrAttackBonus("@save");
            let isSpell = true;
            let ind;

            if(curClass){isSpell = false; ind = curClass;}
            else{ind = spellLevel;}

            if(discription.includes("{@skill")) //Get the skill check
            {
                skill = discription.slice(discription.indexOf("{@skill"));
                skill = skill.slice(7, skill.indexOf("}"));
            }

            else //search for what to check
            {
                let abilityNames = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

                for(let save in abilityNames)
                {
                    if(discription.includes(abilityNames[save]))
                    {
                        skill = abilityNames[save];
                        break;
                    }
                }
            }

            set(ref(database, `playerChar/Vi/responses`), {"ability" : skill, "currentResponse" : lastUse, "toBeat" : toBeat, "castBy" : wholeChar[player][charName], "isSpell" : isSpell, "ind" : ind});

            display = `${wholeChar[player]["charName"]} cast,\n${lastUse}:\n${useInfo} \nWaiting for others to use the Response Action (Under Actions, Miscs)...`;

            if(!spellLevel){display = display.replaceAll("cast", "used the ability");} //At the end
        }

        if(discription.includes("{@response}")) //Needs to check if half damage if sucess
        {
            let wholeRespone = wholeChar["Vi"]["responses"];
            let usersRoll;
            let userAddTo = prompt(`The Current Response is to ${wholeRespone["currentResponse"]}, cast by ${wholeRespone["castBy"]}. This check is checking for ${wholeRespone["ability"]} stat. What is your Modifier? (+/-)`, wholeChar[player]["stats"][wholeRespone["ability"]]);
            let abilityDisc;
            if(wholeRespone["isSpell"]){abilityDisc = wholeSpells[wholeRespone["ind"]][wholeRespone["currentResponse"]]["description"];}
            else{abilityDisc = wholeActions[wholeRespone["ind"]][wholeRespone["currentResponse"]]["description"];}

            set(ref(database, `playerChar/${player}/stats/${wholeRespone["ability"]}`), userAddTo);
            usersRoll = diceRoller("1", "20", userAddTo);

            if(abilityDisc.includes("{@save "))
            {
                let damage;
                damage = splitRoll(abilityDisc, "@save");
                if(abilityDisc.includes("{@scaledamage")){damage = splitRoll(`{@save ${upcast[0].value}`, "@save")};
                damage = diceRoller(damage[0], damage[1], damage[2]);

                if(parseInt(usersRoll) >= parseInt(wholeRespone["toBeat"])) 
                {
                    if(abilityDisc.includes("half damage"))
                    {
                        display = `${wholeChar["charName"]} has succeded the ${wholeRespone["ability"]} check/save (**${usersRoll}**) taking half of the damage. (${damage} / 2) = **${parseInt(damage) / 2}**`;
                    }

                    else
                    {
                        display = `${wholeChar["charName"]} has succeded the ${wholeRespone["ability"]} check/save. With the roll of **${usersRoll}**.`
                    }
                }
            }

            else
            {
                display = `${wholeChar["charName"]} has failed the ${wholeRespone["ability"]} check/save.`;
            }
            
            discription = abilityDisc;
        }

        if(discription.includes("{@damage"))
        {
            let userAddTo = "";
            if(discription.includes("toHit}")){let temp = discription.indexOf("toHit}"); userAddTo = discription.charAt(temp - 2); userAddTo += discription.charAt(temp - 1)}
            else{userAddTo = spellOrAttackBonus("@damage")}
            let accurcy = diceRoller(1, 20, userAddTo, false);
            
            if(discription.includes(currentLv))
            {
                discription = discription.slice(`${discription.indexOf(currentLv)}`);
            }
            
            damage = splitRoll(discription, "@damage");
            if(accurcy.includes("(20)")){damage[0] = `${parseInt(damage[0]) * 2}`}
            damage = diceRoller(damage[0], damage[1], damage[2], false);
            
            if(display){display += `\nAccurcy: ${accurcy} to Hit.\nOn Hit: ${damage} Damage.\n`;}
            else{display = `${wholeChar[player]["charName"]} cast,\n${lastUse}:\n${useInfo}\n\nAccurcy: ${accurcy} to Hit.\nOn Hit: ${damage} Damage.\n`;}
    
            if(!spellLevel){display = display.replaceAll("cast", "used the ability");}
        }
        
        if(discription.includes("{@sDice"))
        {
            damage = splitRoll(discription, "@sDice");
            damage = diceRoller(damage[0], damage[1], damage[2], false);
    
            if(display){display += `\nResult: ${damage}. \n`;}
            else{display = `${wholeChar[player]["charName"]} used the ability, \n${lastUse}:\n${useInfo}\n\nResult: ${damage}. \n`;}
        }

        if(discription.includes("{@sneak"))
        {
            let lvl = currentLv.charAt(0);
            damage = [`${Math.ceil(parseInt(lvl) / 2)}`, "6", "0"];
            damage = diceRoller(damage[0], damage[1], damage[2], false);
    
            if(display){display += `nResult: ${damage}. \n`;}
            else{display = `${wholeChar[player]["charName"]} used the ability, \n${lastUse}:\n${useInfo}\n\nResult: ${damage}. \n`;}
        }
    }

    
    else
    {
        display = `${wholeChar[player]["charName"]} cast:\n${lastUse}\n${useInfo}`;

        if(curClass){display = display.replaceAll("cast", "use the ability");}
    }

    sendDiscordMessage(display);
}

function spellOrAttackBonus(usage)
{
    let userAddTo;

    if(usage == "@damage")
    {
        if(spellLevel){userAddTo = prompt("What is your Spell Attack Bonus?", wholeChar[player]["stats"]["addToSpell"]);}
        else{userAddTo = prompt("What is your Attack Bonus?", wholeChar[player]["stats"]["attackBonus"]);}

        if(spellLevel){set(ref(database, `playerChar/${player}/stats/addToSpell`), userAddTo);}
        else{set(ref(database, `playerChar/${player}/stats/attackBonus`), userAddTo);}
    }
    
    else if(usage == "@save")
    {
        userAddTo = prompt("What is the DC to beat (Spell DC)?", wholeChar[player]["stats"]["spellDC"]);
        set(ref(database, `playerChar/${player}/stats/spellDC`), userAddTo);
    }

    return userAddTo;
}

function splitRoll(discription, splitValue)
{
    let damage;
    damage = discription.slice(discription.indexOf(splitValue));
    damage = damage.slice(splitValue.length + 1, damage.indexOf("}"));
    damage = damage.split("d");
    if(damage[1].includes("+")){let temp = damage[1].split("+"); damage.push(temp[1]); damage[1] = temp[0];}
    else if(damage[1].includes("-")){let temp = damage[1].split("-"); damage.push(`-${temp[1]}`); damage[1] = temp[0];}
    else{damage.push("0");}
    return damage;
}

function handleCreateNew()
{
    if(this.innerHTML == "Create New Spell")
    {
        spellLevel = "0";
        lastSpell = "Sacred Flame";
        set(ref(database, `playerChar/${player}/favorites/spells/${spellLevel}/${lastSpell}`), wholeSpells[spellLevel][lastSpell]);
    }

    else if(this.innerHTML == "Create New Ability")
    {
        curClass = "Artificer";
        lastAbility = "Magical Tinkering";
        set(ref(database, `playerChar/${player}/favorites/actions/${curClass}/${lastAbility}`), wholeActions[curClass][lastAbility]);
    }

    handleEditCard();
}

function handleEditCard()
{
    emptyCards();

    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card .bg-UP-blue notes");
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body notes");
    let cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardBody.appendChild(cardTitle);
    let text;
    let temp;

    if(spellLevel)
    {
        let spell = lastSpell;
        text = ["Name:", "Level:", "Casting Time:", "Range:", "Components:", "Duration:", "Concentration:", "Description:"];
        temp = [`${toTitleCase(wholeFavorite["spells"][spellLevel][spell]["name"])}`, `${spellLevel}`, `${toTitleCase(wholeFavorite["spells"][spellLevel][spell]["castTime"])}`, `${toTitleCase(wholeFavorite["spells"][spellLevel][spell]["range"])}`, `${wholeFavorite["spells"][spellLevel][spell]["components"]}`, `${toTitleCase(wholeFavorite["spells"][spellLevel][spell]["duration"])}`, `${wholeFavorite["spells"][spellLevel][spell]["concentration"]}`, `${wholeFavorite["spells"][spellLevel][spell]["description"]}`];
    }

    else
    {
        let action = lastAbility;
        text = ["Name:", "Tag:", "Description:"];
        temp = [`${toTitleCase(wholeFavorite["actions"][curClass][action]["name"])}`, `${curClass}`, `${wholeFavorite["actions"][curClass][action]["description"]}`];
    }

    for(let i = 0; i < text.length; i++)
    {
        editCardSetup(text, temp, cardBody, i);
    }

    cardTitle.innerHTML = temp[0];
    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.style.margin = "3px";
    cardText.style.display = "inline";
    cardText.innerHTML = "Instructions for auto roll";
    cardBody.appendChild(cardText);
    cardBody.appendChild(document.createElement("br"));

    let btnDiv = document.createElement("div");
    btnDiv.style.textAlign = "center";

    let uploadBtn = document.createElement("button");
    uploadBtn.classList.add("gridButton");
    uploadBtn.classList.add("center");
    uploadBtn.onclick = uploadEdit;
    uploadBtn.innerHTML = "Upload";

    let cancelBtn = document.createElement("button");
    cancelBtn.classList.add("gridButton");
    cancelBtn.classList.add("center");
    cancelBtn.onclick = cancelEdit;
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.style.marginLeft = "5px";
    
    let noteDisplay = document.getElementById("cards");
    noteDisplay.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
    btnDiv.appendChild(uploadBtn);
    btnDiv.appendChild(cancelBtn);
    cardDiv.appendChild(btnDiv);
}

function editCardSetup(text, temp, cardBody, i)
{
    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.style.margin = "3px";
    cardText.style.display = "inline";
    cardText.innerHTML = text[i];
    let cardInput = document.createElement("input");
    if(text[i] == "Description:"){cardInput = document.createElement("textarea"); cardInput.rows = "8"; cardInput.style.width = "80%";}
    cardInput.setAttribute("class", "card-text");
    cardInput.classList.add("spellDisc");
    cardInput.style.margin = "3px";
    cardInput.style.display = "inline";
    cardInput.value = temp[i];
    cardInput.id = text[i].replace(" ", "");
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardInput);
    cardBody.appendChild(document.createElement("br"));
}

function cancelEdit()
{
    if(spellLevel)
    {
        if(lastSpell == "Sacred Flame")
        {
            set(ref(database, `playerChar/${player}/favorites/spells/${spellLevel}/${lastSpell}`), null);
        }
    }

    else
    {
        if(lastAbility == "Magical Tinkering")
        {
            set(ref(database, `playerChar/${player}/favorites/actions/${curClass}/${lastAbility}`), null);
        }   
    }

    emptyCards();
}

function uploadEdit()
{
    let spellDisc = document.getElementsByClassName("spellDisc");

    if(spellLevel)
    {
        set(ref(database, `playerChar/${player}/favorites/spells/${spellLevel}/${lastSpell}`), null);

        set(ref(database, `playerChar/${player}/favorites/spells/${spellDisc[1].value.trim()}/${spellDisc[0].value.trim()}`), 
        {
            castTime : spellDisc[2].value.trim(),
            components : spellDisc[4].value.trim(),
            concentration : spellDisc[6].value.trim(),
            description : spellDisc[7].value.trim(),
            duration : spellDisc[5].value.trim(),
            level : spellDisc[1].value.trim(),
            name : spellDisc[0].value.trim(),
            range : spellDisc[3].value.trim()
        });
    }

    else
    {
        set(ref(database, `playerChar/${player}/favorites/actions/${curClass}/${lastAbility}`), null);

        set(ref(database, `playerChar/${player}/favorites/actions/${spellDisc[1].value.trim()}/${spellDisc[0].value.trim()}`), 
        {
            description : spellDisc[2].value.trim(),
            level : spellDisc[1].value.trim(),
            name : spellDisc[0].value.trim(),
        });
    }

    emptyCards();
}

function handleFavoriteBtn()
{
    let cardName = this.lastChild.classList[0].replaceAll("_", " ");
    let titleName = cardName.replaceAll("/", " or ");

    if(this.lastChild.src.includes("images/unFavorite.png")) //Add to favrites
    {
        this.lastChild.src = "images/favorited.png";
        
        if(spellLevel)
        {
            set(ref(database, `playerChar/${player}/favorites/spells/${spellLevel}/${titleName}`), wholeSpells[spellLevel][cardName]);
        }

        else
        {
            set(ref(database, `playerChar/${player}/favorites/actions/${curClass}/${titleName}`), wholeActions[curClass][cardName]);
        }
    }

    else //Remove from favorites
    {
        this.lastChild.src = "images/unFavorite.png";
        
        if(spellLevel)
        {
            set(ref(database, `playerChar/${player}/favorites/spells/${spellLevel}/${titleName}`), null);
        }

        else
        {
            set(ref(database, `playerChar/${player}/favorites/actions/${curClass}/${titleName}`), null);
        }
        
        emptyCards();
    }
}