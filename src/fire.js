import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, setDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

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

const db = getFirestore(firebaseApp);

async function addNote()
{
    try 
    {
        const docRef = await setDoc(doc(collection(db, "Test", "Test Title")), 
        {
            Title : "Test(Test)",
            Text: "Test??",
            id: "Test Title"
        });
        console.log("Document written with ID: ", docRef.id);
    } 
    
    catch (e) 
    {
        console.error("Error adding document: ", e);
    }
}

addNote();