import { initializeApp } from "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js';


const firebase = require("firebase");
require("firebase/firestore");

const firebaseApp = initializeApp
({
    apiKey: "AIzaSyDojcHZEmju8ix9EK8hQcvg3jsqZ4Okub0",
    authDomain: "unbalancedpowers.firebaseapp.com",
    projectId: "unbalancedpowers",
    storageBucket: "unbalancedpowers.appspot.com",
    messagingSenderId: "88358926340",
    appId: "1:88358926340:web:a9837d91bcc8f28461dd51",
    measurementId: "G-FYM8384HMN"
});

const app = initializeApp(firebaseApp);
const db = getFirestore(app);

async function addNote()
{
    try 
    {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Alan",
          middle: "Mathison",
          last: "Turing",
          born: 1912
        });
      
        console.log("Document written with ID: ", docRef.id);
    } 
    catch (e)
    {
        console.error("Error adding document: ", e);
    }
}

addNote();