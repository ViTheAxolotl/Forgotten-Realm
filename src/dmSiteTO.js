"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, setDoc, getDocs, deleteDoc, doc, collection, query } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
 
const FirebaseApp = initializeApp
({
    apiKey: "AIzaSyAfgrY2zV_ysEGvNLPAd5Rj616NqSyA3og",
    authDomain: "forgottenrealmto.firebaseapp.com",
    projectId: "forgottenrealmto",
    storageBucket: "forgottenrealmto.appspot.com",
    messagingSenderId: "222985667175",
    appId: "1:222985667175:web:2fabd6362b97aba3f88ac2",
    measurementId: "G-RLKWDFM6N4"
});

const db = getFirestore(FirebaseApp);
let wholeData = {};
let div = document.getElementById("story");

async function emptyTOCollection()
{
    let colToRemove = [];
    const q = query(collection(db, currentTO));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {colToRemove.push(doc.data().name);});

    for(let docum of colToRemove)
    {
        await deleteDoc(doc(db, cName, docum.slice(0, docum.indexOf("-"))));
    }
}

export async function uploadTO(wholeData)
{
    emptyTOCollection();

    for(let key of Object.keys(wholeData))
    {
        if(key != "invisible" && wholeData[key].border != "invisible")
        {
            let info = getElementById(`Selected_${wholeData[key].name}`);
            const docRef = await setDoc(doc(toDb, "currentTO", key), 
            {
                position: document.getElementById(`Order_${key.name}`).value,
                selected: document.getElementById(`Selected_${key.name}`).value
            });
        }
    }

    let curDate = new Date().toLocaleTimeString();
    let date = document.createElement("h3");
    date.innerHTML = `Current Turn Order at time of ${curDate}`;
    div.appendChild(date);
}