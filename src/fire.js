import { initializeApp } from "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";

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
    db.collection("users").add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

addNote();