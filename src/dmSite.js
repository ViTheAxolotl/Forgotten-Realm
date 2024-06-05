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
});

const currentTORef = ref(database, 'currentTO/');
onValue(currentTORef, (snapshot) => 
{
    const data = snapshot.val();
    wholeTO = data;
});

const presetRef = ref(database, 'preset/');
onValue(presetRef, (snapshot) => 
{
    const data = snapshot.val();
    wholePre = data;
});

let fiveButtons = [];
let wholeDB = {};
let wholeTO = {};
let wholePre = {};
let div = document.getElementById("story");
let editDiv;
let imgs;
let curCharacter;
let htmlInfo = window.location.href;
let temp;
let mode;

function init()
{
    htmlInfo = htmlInfo.split("?");
    htmlInfo = htmlInfo[1];
    
    if(htmlInfo == "Axo1ot1")
    {
        fetch('https://vitheaxolotl.github.io/Forgotten-Realm/src/files.json').then(res => res.json()).then((json) => imgs = json);
        for(let button of document.getElementsByTagName("button"))
        {
            switch(button.id)
            {
                case "add":
                    fiveButtons.push(button);
                    button.onclick = handleAdd;
                    break;

                case "remove":
                    fiveButtons.push(button);
                    button.onclick = handleRemove;
                    break;

                case "pre":
                    fiveButtons.push(button);
                    button.onclick = handlePreset;
                    break;

                case "quick":
                    fiveButtons.push(button);
                    button.onclick = handleQuick;
                    break;

                case "turnO":
                    fiveButtons.push(button);
                    button.onclick = handleTurn;
                    break;

                case "changeMap":
                    fiveButtons.push(button);
                    button.onclick = handleChangeMap;
                    break;

                case "save":
                    fiveButtons.push(button);
                    button.onclick = handleSave;
                    break;

                case "load":
                    fiveButtons.push(button);
                    button.onclick = handleLoad;
                    break;
                
                case "generate":
                    fiveButtons.push(button);
                    button.onclick = handleGenerate;
                    break;
            }
        }
    }

    else
    {
        alert("Wrong Credentails!!!")
    }
}

function handleAdd()
{
    hideButtons();

    mode = "add";
    curCharacter = {border: "invisible", currentHp: "20", map: "", maxHp: "20", name: "invisible-", title: " ", xPos: "5", yPos: "D"};
    makeToken(curCharacter);
    editDiv = document.getElementById("invisible--div");
    temp = curCharacter.name;
    handleEdit();

    let reset = document.getElementById("reset");
    reset.onclick = handleDone;
}

function makeToken(key)
{
    let token = [document.createElement("div"), document.createElement("img"), document.createElement("img"), document.createElement("img")];
    token[0].id = `${key.name}-div`;
    token[0].classList = "bg-UP-grey objectBorder";
    token[0].style.margin = "5px";
    token[0].style.position = "relative";
    token[0].style.minHeight = "82px";
    token[0].style.minWidth = "82px";
    token[1].src = `images/map/tokens/${key.name}.png`;
    token[1].id = key.name;
    token[1].classList = `tokens ${key.name} char`;
    token[2].src = `images/map/tokens/${key.border}Border.png`;
    token[2].id = key.border;
    token[2].classList = `tokens ${key.name} border_`;
    token[3].src = updateHpPic(key.maxHp, key.currentHp);
    token[3].id = "hp";
    token[3].classList = `tokens ${key.name} hp`;
    token[2].onclick = handleDeleteOrEdit;

    token[0].appendChild(token[1]);
    token[0].appendChild(token[2]);
    token[0].appendChild(token[3])
    div.appendChild(token[0]); 
}

function handleRemove()
{
    hideButtons();

    for(let key of Object.keys(wholeDB))
    {
        if(key != "invisible")
        {
            makeToken(wholeDB[key]);
        }
    }

    addDone();
}

function handleDeleteOrEdit()
{
    let currentDiv = this.parentElement;
    let currentEOrD = document.getElementsByClassName("eOrD");
    let editB = document.createElement("button");
    let deleteB = document.createElement("button");

    if(currentEOrD.length > 0)
    {
        for(let i = 0; i < 2; i++)
        {
            currentEOrD[0].parentElement.removeChild(currentEOrD[0]);
        }
    }

    editDiv = currentDiv;
    editB.innerHTML = "edit";
    editB.onclick = handleEdit;
    temp = this.classList[1];
    editB.classList = `eOrD ${this.classList[1]}`;
    editB.id = "edit";
    editB.style.margin = `5px 5px 5px 79px`;
    deleteB.innerHTML = "delete";
    deleteB.onclick = deleteToken;
    deleteB.classList = `eOrD ${this.classList[1]}`;
    currentDiv.appendChild(editB);
    currentDiv.appendChild(deleteB);
}

function deleteToken()
{
    for(let key of Object.keys(wholeDB))
    {
        if(key + "-" == this.classList[1])
        {
            try
            { 
                set(ref(database, `currentMap/${key}`), null);
            }
            
            catch (e) 
            {
                console.error("Error adding document: ", e);
            }
        }
    }
    
    resetDelete();
}
 
function handleEdit()
{
    let names = ["border", "name", "maxHp", "currentHp", "title", "xPos", "yPos"];
    let txtFeilds = [];
    let buttons = [document.createElement("button"), document.createElement("button")];
    let buttonsName = ["edit", "back"];
    let currentEOrD = document.getElementsByClassName("eOrD");

    if(currentEOrD.length > 0)
    {
        for(let i = 0; i < 2; i++)
        {
            currentEOrD[0].parentElement.removeChild(currentEOrD[0]);
        }
    }

    for(let i = 0; i < 2; i++)
    {
        buttons[i].id = buttonsName[i];
        buttons[i].innerHTML = buttonsName[i];
        buttons[i].style.display = "inline";
        buttons[i].style.width = "80px";
    }

    buttons[0].onclick = addToken;
    buttons[0].style.margin = "5px 2.5px 5px 42%";
    buttons[1].onclick = resetDelete;
    buttons[1].style.margin = "5px 5px 5px 2.5px";
    buttons[1].id = "reset";

    if(temp != undefined)
    {
        if(mode == "add")
        {
            for(let key of Object.keys(wholeDB))
            {
                if(wholeDB[key].name == temp)
                {
                    curCharacter = wholeDB[key];
                }
            }
        }

        else if(mode == "preset")
        {
            for(let key of Object.keys(wholePre))
            {
                if(wholePre[key].name == temp)
                {
                    curCharacter = wholePre[key];
                }
            } 

            buttons[0].classList.add(curCharacter.name); //Test if Pre works!!
            buttons[0].onclick = function () {let id = this.classList[0].slice(0, this.classList[0].length - 1); set(ref(database, `currentMap/${id}`), wholePre[id]);};
            buttons[1].onclick = resetPreset;
        }
    }
    
    for(let i = 0; i < 7; i++)
    {
        let label = document.createElement("h6");
        label.innerHTML = `${names[i]}:`;
        label.style.display = "inline";
        label.classList = "color-UP-yellow";
        
        if(i == 0)
        {
            label.style.margin = `5px 5px 5px 79px`;
            txtFeilds[i] = document.createElement("select");
            txtFeilds[i].name = names[i];

            for(let key of Object.keys(imgs["borders"]))
            {
                let currentBorder = imgs["borders"][key];
                let option = document.createElement("option");
                option.value = key;
                option.text = currentBorder.slice(currentBorder.indexOf("ns/") + 3).replace("Border.png", "");
                txtFeilds[i].appendChild(option);
                txtFeilds[i].onchange = updateBorderPic;
            }
        }

        else if(i == 1)
        {
            txtFeilds[i] = document.createElement("select");
            txtFeilds[i].name = names[i];

            for(let key of Object.keys(imgs["tokens"]))
            {
                let currentBorder = imgs["tokens"][key];
                let option = document.createElement("option");
                option.value = key;
                option.text = currentBorder.slice(currentBorder.indexOf("ns/") + 3).replace(".png", "");
                txtFeilds[i].appendChild(option);
                txtFeilds[i].onchange = updateTokenPic;
            }
        }

        else if(i == 3)
        {
            txtFeilds[i] = document.createElement("input");
            txtFeilds[i].name = names[i];
            txtFeilds[i].type = "number";
            txtFeilds[i].min = "0";
            txtFeilds[i].step = "1";
            txtFeilds[i].onchange = handleChangeCurrent;
        }

        else
        {
            txtFeilds[i] = document.createElement("input");
        }
        
        txtFeilds[i].style.width = "75px";
        txtFeilds[i].id = names[i];
        txtFeilds[i].style.margin = "5px";
        editDiv.appendChild(label);
        editDiv.appendChild(txtFeilds[i]);
    }

    txtFeilds[1].value = curCharacter.name;
    txtFeilds[2].value = curCharacter.maxHp;
    txtFeilds[3].value = curCharacter.currentHp;
    txtFeilds[4].value = curCharacter.title;
    txtFeilds[5].value = curCharacter.xPos;
    txtFeilds[6].value = curCharacter.yPos;
    editDiv.appendChild(document.createElement("h6"));
    buttons.forEach(em => {editDiv.appendChild(em)});
}

function updateBorderPic()
{
    this.parentNode.childNodes[1].src = imgs["borders"][this[this.selectedIndex].value];
}

function updateTokenPic()
{
    this.parentNode.childNodes[0].src = imgs["tokens"][this[this.selectedIndex].value];
}

function handleChangeCurrent()
{
    let maxHp = document.getElementById("maxHp").value;
    let currentHp = this.value;

    if(parseInt(currentHp) > parseInt(maxHp))
    {
        this.value = maxHp;
    }

    this.parentNode.childNodes[2].src = updateHpPic(maxHp, currentHp);
}

function updateHpPic(maxHp, currentHp)
{
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

function resetState()
{
    let aboveDiv = div.parentElement;
    div.remove();
    div = document.createElement("div");
    div.id = "story";
    div.classList = "bg-UP-purple color-UP-black col-md-12 col-sm-12";
    aboveDiv.insertBefore(div, aboveDiv.childNodes[2]);
}

function resetDelete()
{
    setTimeout(() => {resetState(); handleRemove();}, 1500);
}

function resetQuick()
{
    setTimeout(() => {resetState(); handleQuick();}, 1500);
}

function resetPreset()
{
    setTimeout(() => {resetState(); handlePreset();}, 1500);
}

function handleQuick()
{
    hideButtons();

    let curDate = new Date().toLocaleTimeString();
    let date = document.createElement("h3");
    date.innerHTML = `Current Hps at time of ${curDate}`;
    div.appendChild(date);

    for(let key of Object.keys(wholeDB))
    {
        if(key != "invisible" && wholeDB[key].border != "invisible")
        {
            makeToken(wholeDB[key]);
            let currentDiv = document.getElementById(`${wholeDB[key].name}-div`);
            let names = ["xPos", "yPos", "currentHp", "maxHp"];
            let feilds = [document.createElement("h6"), document.createElement("h6"), document.createElement("input"), document.createElement("h6")]
            
            feilds[0].innerHTML = wholeDB[key].xPos;
            feilds[1].innerHTML = wholeDB[key].yPos;
            feilds[2].value = wholeDB[key].currentHp;
            feilds[2].id = "newHp";
            feilds[2].style.width = "3%";
            feilds[3].innerHTML = wholeDB[key].maxHp;

            for(let i = 0; i < 4; i++)
            {
                let label = document.createElement("h6");
                label.innerHTML = `${names[i]}:`;
                label.style.display = "inline";
                label.classList = "color-UP-yellow";

                if(i == 0){label.style.margin = `5px 5px 5px 79px`;}
                else{label.style.margin = `5px`;}

                feilds[i].style.display = "inline";
                currentDiv.appendChild(label);
                currentDiv.appendChild(feilds[i]);
            }

            let upload = document.createElement("button");
            upload.id = wholeDB[key].name;
            upload.onclick = quickUpdate;
            upload.style.margin = "5px";
            upload.style.width = "6%";
            upload.innerHTML = "Upload";
            currentDiv.appendChild(upload);
        }
    }

    addDone();
}

function quickUpdate()
{
    let newHp = document.getElementById('newHp');
    let id = this.id.slice(0, this.id.indexOf("-"));

    set(ref(database, `currentMap/${id}`),
    {
        border : wholeDB[id].border,
        currentHp : newHp.value,
        maxHp : wholeDB[id].maxHp,
        map : "",
        name : wholeDB[id].name,
        title : wholeDB[id].title,
        xPos : wholeDB[id].xPos,
        yPos : wholeDB[id].yPos
    });

    resetQuick();
}

function handlePreset()
{
    hideButtons();
    for(let token of Object.keys(wholePre))
    {
        makeToken(wholePre[token]);
        let currentDiv = document.getElementById(`${wholePre[token].name}-div`);
        let names = ["Edit", "Delete"];
        let feilds = [document.createElement("button"), document.createElement("button")];

        for(let i = 0; i < 2; i++)
        {
            let label = document.createElement("h6");
            label.innerHTML = `${names[i]}:`;
            label.style.display = "inline";
            label.classList = "color-UP-yellow";

            if(i == 0){label.style.margin = `5px 5px 5px 79px`;}
            else{label.style.margin = `5px`;}

            feilds[i].style.display = "inline";
            feilds[i].id = wholePre[token].name.slice(0, wholePre[token].name.length - 1);
            feilds[i].style.margin = "5px";
            feilds[i].style.width = "9%";
            feilds[i].innerHTML = names[i];
            currentDiv.appendChild(label);
            currentDiv.appendChild(feilds[i]);
        }

        feilds[0].onclick = addPreset;
        feilds[1].onclick = deletePreset;
    }
    
    let addButton = document.createElement("button");
    addButton.innerHTML = "Create New";
    addButton.style.margin = "5px";
    addButton.onclick = function () {addPreset({border : "", currentHp : "", maxHp : "", map : "", name : "", title : "", xPos : "", yPos : ""});};
    div.appendChild(addButton);

    addDone();
}

function deletePreset()
{
    set(ref(database, `preset/${this.id}`), null);
    resetPreset();
}

function addPreset()
{
    let token = wholePre[this.id];
    editDiv = document.getElementById(`${token.name}-div`);
    resetState();
    temp = token.name;
    mode = "preset";
    handleEdit();
    mode = "";
}

function makeTORow(key)
{
    let TORow = [document.createElement("div"), ["Name", "Order", "Selected"], [document.createElement("h6"), document.createElement("input"), document.createElement("input"), document.createElement("button")]];
    TORow[0].id = `${key.charName}-div`;
    TORow[0].classList = "bg-UP-grey objectBorder center";
    TORow[0].style.margin = "5px";
    TORow[0].style.position = "relative";
    TORow[0].style.minHeight = "82px";
    TORow[0].style.minWidth = "82px";

    for(let i = 0; i < 3; i++)
    {
        let label = document.createElement("h6");
        label.innerHTML = `${TORow[1][i]}:`;
        label.style.display = "inline";
        label.classList = "color-UP-yellow";
        label.style.margin = `5px`;

        TORow[2][i].style.display = "inline";
        TORow[2][i].id = `${TORow[1][i]}_${key.charName}`;
        TORow[0].appendChild(label);
        TORow[0].appendChild(TORow[2][i]);                
    }

    TORow[2][3].innerHTML = "Remove";
    TORow[2][3].classList = "gridButton";
    TORow[2][3].onclick = removeFromTO;
    TORow[2][3].id = `${key.charName}_Remove`;
    TORow[2][3].style.margin = "5px";
    TORow[0].appendChild(TORow[2][3]);
    div.insertBefore(TORow[0], div.firstChild);
}

function DeleteKeys(myObj, array) 
{
    for (let index = 0; index < array.length; index++) 
    {
        delete myObj[array[index]];
    }

    return myObj;
}

function removeFromTO()
{
    let nodeName = this.id.replace("_Remove", "");

    if(Object.keys(wholeTO).includes(nodeName))
    {
        wholeTO = DeleteKeys(wholeTO, [nodeName]);
    }

    document.getElementById(`${nodeName}-div`).remove();
}

function addTORow(rowName)
{
    if(wholeTO == null){wholeTO = {};}
    let newRow = {charName : rowName, position : 0, selected : false};
    wholeTO[rowName] = newRow;
    makeTORow(newRow);

    let feilds = [document.getElementById(`Name_${rowName}`), document.getElementById(`Order_${rowName}`), document.getElementById(`Selected_${rowName}`)];
            
    feilds[0].innerHTML = newRow.charName;
    feilds[1].value = newRow.position;
    feilds[2].value = newRow.selected;
}

function handleTurn()
{
    hideButtons();
    setTimeout(() => 
    {
        if(wholeTO != null)
        {
            for(let key of Object.keys(wholeTO))
            {
                makeTORow(wholeTO[key]);
                let feilds = [document.getElementById(`Name_${wholeTO[key].charName}`), document.getElementById(`Order_${wholeTO[key].charName}`), document.getElementById(`Selected_${wholeTO[key].charName}`)]
                
                feilds[0].innerHTML = wholeTO[key].charName;
                feilds[1].value = wholeTO[key].position;
                feilds[2].value = wholeTO[key].selected;
            }
        }
    
        let buttons = [document.createElement("button"), document.createElement("button")];
        let names = ["Add", "Upload"];
        buttons[0].onclick = function () {let txtFeild = document.getElementById("newRow"); addTORow(txtFeild.value); txtFeild.value = "";};
        buttons[1].onclick = uploadTO;

        for(let i = 0; i < 2; i++)
        {
            buttons[i].style.margin = "5px";
            buttons[i].innerHTML = names[i];
            buttons[i].id = `${names[i]}TO`;
            div.appendChild(buttons[i]); 
            
            if(i == 0)
            {
                let rowName = document.createElement("input");

                rowName.id = "newRow";
                rowName.placeholder = "Name of New Row";
                rowName.style.display = "inline";
                buttons[i].style.display = "inline";
                buttons[i].style.width = "80%";
                div.appendChild(rowName);
            }
        }
    
        addDone();
    }, 1500);
}

function uploadTO()
{
    temp = wholeTO;
    emptyTOCollection();

    for(let key of Object.keys(temp))
    {   
        setTimeout(() => {uploadRowTO(key)}, 250);
    }

    let curDate = new Date().toLocaleTimeString();
    let date = document.createElement("h3");
    date.innerHTML = `Current Turn Order at time of ${curDate}`;
    div.appendChild(date);
}

function uploadRowTO(key)
{
    set(ref(database, `currentTO/${key}`),
    {
        charName : document.getElementById(`Name_${temp[key].charName}`).innerHTML,
        position : document.getElementById(`Order_${temp[key].charName}`).value,
        selected : document.getElementById(`Selected_${temp[key].charName}`).value
    });
}

function handleChangeMap()
{
    hideButtons();

    let select = document.createElement("select");
    select.classList = "center blo";
    for(let keys of Object.keys(imgs["mapName"]))
    {
        let mapImg = imgs["mapName"][keys];
        let option = document.createElement("option");
        option.value = keys;
        option.text = mapImg.slice(mapImg.indexOf("ap/") + 3).replace(".jpg", "");
        select.appendChild(option);
    }

    let button = document.createElement("button");
    button.innerHTML = "Change";
    button.onclick = updateMap;

    div.appendChild(select);
    div.appendChild(button);
    addDone();
}

function updateMap()
{
    let b, c, mH, m, n, t, x, y;
    
    for(let key of Object.keys(wholeDB))
    {
        if(wholeDB[key].name == "invisible-")
        {
            b = wholeDB[key].border;
            c = wholeDB[key].currentHp;
            mH = wholeDB[key].maxHp;
            m = this.parentNode.childNodes[8][this.parentNode.childNodes[8].selectedIndex].value;
            n = wholeDB[key].name;
            t = wholeDB[key].title;
            x = wholeDB[key].xPos;
            y = wholeDB[key].yPos;
        }
    }

    set(ref(database, `currentMap/${n.slice(0, n.indexOf("-"))}`),
    {
        border : b,
        currentHp : c,
        maxHp : mH,
        map : m,
        name : n,
        title : t,
        xPos : x,
        yPos : y
    });

    handleDone();
}

function listSelect()
{
    let collectionNames = [];
    const tempRef = ref(database, `lists/`);
    onValue(tempRef, (snapshot) => 
    {
        const data = snapshot.val();
        for(let point of Object.keys(data))
        {
            collectionNames.push(point);
        }
    });

    let selectNames = document.createElement("select");

    setTimeout(() => 
    {
        for(let cName of collectionNames)
        {
            if(cName != "currentMap")
            {
                let option = document.createElement("option");
                option.value = cName;
                option.text = cName;
                selectNames.appendChild(option); 
            }  
        }
    }, 200);

    selectNames.classList = "center blo";
    selectNames.id = "selectNames";

    div.appendChild(selectNames);
}

function handleSave()
{
    hideButtons();
    listSelect();

    let saveName = document.createElement("input");
    let label = document.createElement("h6");
    let button = document.createElement("button");
    
    label.innerHTML = `Save Name:`;
    label.style.display = "inline";
    label.classList = "color-UP-yellow";
    label.style.margin = "5px 5px 5px 40%";
    saveName.id = "saveName";
    saveName.style.margin = "5px";
    button.innerHTML = "Save";
    button.onclick = handleUploadeSave;
    
    div.appendChild(label);
    div.appendChild(saveName);
    div.appendChild(button);
    addDone();
}

function handleUploadeSave()
{
    let saveName = document.getElementById("saveName");
    let selectNames = document.getElementById("selectNames");
    let cName = saveName.value;

    if(saveName.value == "")
    {
        cName = selectNames[selectNames.selectedIndex].value;
        emptyCollection(cName);
    }

    for(let key of Object.keys(wholeDB))
    {
        set(ref(database, `${cName}/${key}`), wholeDB[key]);
    }

    set(ref(database, `${cName}/${Object.keys(wholeDB)[0]}`), wholeDB[Object.keys(wholeDB)[0]]);

    wholeDB[Object.keys(wholeDB)[0]]

    set(ref(database, `lists/${cName}`), {name : `${cName}`});

    handleDone();
}

function emptyCollection(cName)
{
    set(ref(database, `${cName}/`), null);
}

function emptyTOCollection()
{
    set(ref(database, `currentTO/`), null);
}

function handleLoad()
{
    hideButtons();
    listSelect();

    let goButton = document.createElement("button");

    goButton.style.margin = "5px";
    goButton.innerHTML = "Load";
    goButton.onclick = loadMap;
    div.appendChild(goButton);
    addDone();
}

function loadMap()
{
    let selectNames = document.getElementById("selectNames");
    let cName = "";
    cName = selectNames[selectNames.selectedIndex].value;
    emptyCollection("currentMap");

    const tempRef = ref(database, `${cName}/`);
    onValue(tempRef, (snapshot) => 
    {
        const data = snapshot.val();
        wholeDB = data;
    });

    setTimeout(() => 
    {  
        temp = wholeDB;
        for(let key of Object.keys(temp))
        {
            set(ref(database, `currentMap/${key}`), temp[key]);
        }

        handleDone();
    }, 500);
}

function handleGenerate()
{
    set(ref(database, `preset/sky`), 
    {
        border : "green",
        currentHp : "32",
        maxHp : "32",
        map : "",
        name : "sky-",
        title : " ",
        xPos : "5",
        yPos : "D"
    });

    alert("Generated!!");
}

function handleDone()
{
    setInterval(() => {location.reload();}, 1000);
}

function hideButtons()
{
    if(fiveButtons != [])
    {
        for(let button of fiveButtons)
        {
            button.remove();
        }

        fiveButtons = [];
    }
}

function addDone()
{
    let doneButton = document.createElement("button");
    doneButton.id = "done";
    doneButton.innerHTML = "Done";
    doneButton.onclick = handleDone;
    div.appendChild(doneButton);
}

function addToken()
{
    let b = document.getElementById("border").value;
    let c = document.getElementById("currentHp").value;
    let mH = document.getElementById("maxHp").value;
    let n = document.getElementById("name").value;
    let t = document.getElementById("title").value;
    let x = document.getElementById("xPos").value;
    let y = document.getElementById("yPos").value;
    let id = n.slice(0, n.indexOf("-"));
    
    if(Object.keys(wholeDB).includes(id) && mode == "add")
    {
        id = id + "1";

        while(Object.keys(wholeDB).includes(id))
        {
            id = id.slice(0, length - 1) + (parseInt(id.charAt(length - 1)) + 1);
        }

        mode = "none";
    }

    set(ref(database, `currentMap/${id}`),
    {
        border : b,
        currentHp : c,
        maxHp : mH,
        map : "",
        name : n,
        title : t,
        xPos : x,
        yPos : y,
    });

    resetDelete();
}

init();