"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, setDoc, getDocs, deleteDoc, doc, collection, query } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

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
let fiveButtons = [];
let wholeData = {};
let div = document.getElementById("story");
let editDiv;
let imgs;
let collectionNames = [];
let curCharacter;
let htmlInfo = window.location.href;
let wholeTO = {};

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

                case "quick":
                    fiveButtons.push(button);
                    button.onclick = handleQuick;
                    break;

                case "turn":
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
            }
        }

        readTokens();
    }

    else
    {
        alert("Wrong Credentails!!!")
    }
}

function handleAdd()
{
    hideButtons();

    curCharacter = {border: "invisible", currentHp: "20", map: "", maxHp: "20", name: "invisible-", title: " ", xPos: "5", yPos: "D"};
    makeToken(curCharacter);
    editDiv = document.getElementById("invisible--div");
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

async function readTokens()
{
    wholeData = {};
    const q = query(collection(db, "currentMap"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        wholeData[doc.id] = doc.data();
    });
}

function handleRemove()
{
    hideButtons();

    for(let key of Object.keys(wholeData))
    {
        if(key != "invisible")
        {
            makeToken(wholeData[key]);
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
    editB.classList = `eOrD ${this.classList[1]}`;
    editB.id = "edit";
    editB.style.margin = `5px 5px 5px 79px`;
    deleteB.innerHTML = "delete";
    deleteB.onclick = deleteToken;
    deleteB.classList = `eOrD ${this.classList[1]}`;
    currentDiv.appendChild(editB);
    currentDiv.appendChild(deleteB);
}

async function deleteToken()
{
    for(let key of Object.keys(wholeData))
    {
        if(wholeData[key].name == this.classList[1])
        {
            try
            { 
                await deleteDoc(doc(db, "currentMap", key));
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

    if(this != undefined)
    {
        for(let key of Object.keys(wholeData))
        {
            if(wholeData[key].name == this.classList[1])
            {
                curCharacter = wholeData[key];
            }
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

function resetDelete()
{
    readTokens();
    setTimeout(() => {
        let aboveDiv = div.parentElement;
        div.remove();
        div = document.createElement("div");
        div.id = "story";
        div.classList = "bg-UP-purple color-UP-black col-md-12 col-sm-12";
        aboveDiv.insertBefore(div, aboveDiv.childNodes[2]);
        handleRemove();}, 1500);
    
}

function resetQuick()
{
    readTokens();
    setTimeout(() => {
        let aboveDiv = div.parentElement;
        div.remove();
        div = document.createElement("div");
        div.id = "story";
        div.classList = "bg-UP-purple color-UP-black col-md-12 col-sm-12";
        aboveDiv.insertBefore(div, aboveDiv.childNodes[2]);
        handleQuick();}, 1500);
    
}

function handleQuick()
{
    hideButtons();
    let curDate = new Date().toLocaleTimeString();
    let date = document.createElement("h3");
    date.innerHTML = `Current Hps at time of ${curDate}`;
    div.appendChild(date);

    for(let key of Object.keys(wholeData))
    {
        if(key != "invisible" && wholeData[key].border != "invisible")
        {
            makeToken(wholeData[key]);
            let currentDiv = document.getElementById(`${wholeData[key].name}-div`);
            let names = ["xPos", "yPos", "currentHp", "maxHp"];
            let feilds = [document.createElement("h6"), document.createElement("h6"), document.createElement("input"), document.createElement("h6")]
            
            feilds[0].innerHTML = wholeData[key].xPos;
            feilds[1].innerHTML = wholeData[key].yPos;
            feilds[2].value = wholeData[key].currentHp;
            feilds[2].id = "newHp";
            feilds[2].style.width = "3%";
            feilds[3].innerHTML = wholeData[key].maxHp;

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
            upload.id = wholeData[key].name;
            upload.onclick = quickUpdate;
            upload.style.margin = "5px";
            upload.style.width = "6%";
            upload.innerHTML = "Upload";
            currentDiv.appendChild(upload);
        }
    }

    addDone();
}

async function quickUpdate()
{
    let newHp = document.getElementById('newHp');
    let id = this.id.slice(0, this.id.indexOf("-"));

    const docRef = await setDoc(doc(db, "currentMap", id), 
    {
        border : wholeData[id].border,
        currentHp : newHp.value,
        maxHp : wholeData[id].maxHp,
        map : "",
        name : wholeData[id].name,
        title : wholeData[id].title,
        xPos : wholeData[id].xPos,
        yPos : wholeData[id].yPos
    });

    resetQuick();
}

async function readTurnOrder()
{
    wholeTO = {};
    const q = query(collection(db, "currentTO"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        wholeTO[doc.id] = doc.data();
    });
}

function makeTORow(key)
{
    let TORow = [document.createElement("div"), ["Name", "Order", "Selected"], [document.createElement("input"), document.createElement("input"), document.createElement("input"), document.createElement("button")]];
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
    div.appendChild(TORow[0]);
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

function handleTurn()
{
    hideButtons();
    readTurnOrder();
    setTimeout(() => 
    {
        for(let key of Object.keys(wholeTO))
        {
            makeTORow(wholeTO[key]);
            let feilds = [document.getElementById(`Name_${wholeTO[key].charName}`), document.getElementById(`Order_${wholeTO[key].charName}`), document.getElementById(`Selected_${wholeTO[key].charName}`)]
            
            feilds[0].value = wholeTO[key].charName;
            feilds[1].value = wholeTO[key].position;
            feilds[2].value = wholeTO[key].selected;
        }
    
        let upload = document.createElement("button");
        upload.style.margin = "5px";
        upload.innerHTML = "Upload";
        upload.id = "UploadTO";
        upload.onclick = uploadTO;
        div.appendChild(upload);
    
        addDone();
    }, 1500);
}

async function uploadTO()
{
    emptyTOCollection();

    for(let key of Object.keys(wholeTO))
    {   
        setTimeout(() => {uploadRowTO(key)}, 250);
    }

    let curDate = new Date().toLocaleTimeString();
    let date = document.createElement("h3");
    date.innerHTML = `Current Turn Order at time of ${curDate}`;
    div.appendChild(date);
}

async function uploadRowTO(key)
{
    const docRef = await setDoc(doc(db, "currentTO", key), 
    {
        charName : document.getElementById(`Name_${wholeTO[key].charName}`).value,
        position : document.getElementById(`Order_${wholeTO[key].charName}`).value,
        selected : document.getElementById(`Selected_${wholeTO[key].charName}`).value
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

async function updateMap()
{
    let b, c, mH, m, n, t, x, y;
    
    for(let key of Object.keys(wholeData))
    {
        if(wholeData[key].name == "invisible-")
        {
            b = wholeData[key].border;
            c = wholeData[key].currentHp;
            mH = wholeData[key].maxHp;
            m = this.parentNode.childNodes[6][this.parentNode.childNodes[6].selectedIndex].value;
            n = wholeData[key].name;
            t = wholeData[key].title;
            x = wholeData[key].xPos;
            y = wholeData[key].yPos;
        }
    }

    const docRef = await setDoc(doc(db, "currentMap", n.slice(0, n.indexOf("-"))), 
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

async function handleSave()
{
    hideButtons();
    readTokens();

    collectionNames = [];
    const q = query(collection(db, "list"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        collectionNames.push(doc.data().name);
    });
    
    let selectNames = document.createElement("select");
    let saveName = document.createElement("input");
    let label = document.createElement("h6");
    let button = document.createElement("button");

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

    selectNames.classList = "center blo";
    selectNames.id = "selectNames";
    label.innerHTML = `Save Name:`;
    label.style.display = "inline";
    label.classList = "color-UP-yellow";
    label.style.margin = "5px 5px 5px 40%";
    saveName.id = "saveName";
    saveName.style.margin = "5px";
    button.innerHTML = "Save";
    button.onclick = handleUploadeSave;
    div.appendChild(selectNames);
    div.appendChild(label);
    div.appendChild(saveName);
    div.appendChild(button);
    addDone();
}

async function handleUploadeSave()
{
    let saveName = document.getElementById("saveName");
    let selectNames = document.getElementById("selectNames");
    let cName = saveName.value;

    if(saveName.value == "")
    {
        cName = selectNames[selectNames.selectedIndex].value;
        emptyCollection(cName);
    }

    for(let key of Object.keys(wholeData))
    {
        const docRef = await setDoc(doc(db, cName, key), wholeData[key]);
    }

    await setDoc(doc(db, cName, Object.keys(wholeData)[0]), wholeData[Object.keys(wholeData)[0]]);

    const docRef = await setDoc(doc(db, "list", cName), 
    {
        name : cName
    });

    handleDone();
}

async function emptyCollection(cName)
{
    let colToRemove = [];
    const q = query(collection(db, cName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {colToRemove.push(doc.data().name);});

    for(let docum of colToRemove)
    {
        await deleteDoc(doc(db, cName, docum.slice(0, docum.indexOf("-"))));
    }
}

async function emptyTOCollection()
{
    let colToRemove = [];
    const q = query(collection(db, "currentTO"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {colToRemove.push(doc.data().charName);});

    for(let docum of colToRemove)
    {
        await deleteDoc(doc(db, "currentTO", docum));
    }
}

async function handleLoad()
{
    hideButtons();

    collectionNames = [];
    let goButton = document.createElement("button");
    const q = query(collection(db, "list"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        collectionNames.push(doc.data().name);
    });
    
    let selectNames = document.createElement("select");
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

    selectNames.classList = "center blo";
    selectNames.id = "selectNames";
    goButton.style.margin = "5px";
    goButton.innerHTML = "Load";
    goButton.onclick = loadMap;
    div.appendChild(selectNames);
    div.appendChild(goButton);
    addDone();
}

async function loadMap()
{
    let selectNames = document.getElementById("selectNames");
    let cName = "";
    cName = selectNames[selectNames.selectedIndex].value;
    emptyCollection("currentMap");
    wholeData = {};

    const q = query(collection(db, cName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => 
    {
        // doc.data() is never undefined for query doc snapshots
        wholeData[doc.id] = doc.data();
    });

    for(let key of Object.keys(wholeData))
    {
        const docRef = await setDoc(doc(db, "currentMap", key), wholeData[key]);
    }

    handleDone();
}

function handleDone()
{
    setInterval(() => {location.reload();}, 2000);
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

async function addToken()
{
    let b = document.getElementById("border").value;
    let c = document.getElementById("currentHp").value;
    let mH = document.getElementById("maxHp").value;
    let n = document.getElementById("name").value;
    let t = document.getElementById("title").value;
    let x = document.getElementById("xPos").value;
    let y = document.getElementById("yPos").value;

    const docRef = await setDoc(doc(db, "currentMap", n.slice(0, n.indexOf("-"))), 
    {
        border : b,
        currentHp : c,
        maxHp : mH,
        map : "",
        name : n,
        title : t,
        xPos : x,
        yPos : y
    });

    resetDelete();
}

init();