import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

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
const auth = getAuth();
let url = window.location.href.split("/");
let player;
let username, password, backBtn, loginBtn;

function init()
{
    username = document.getElementById("username");
    password = document.getElementById("password");
    
    backBtn = document.getElementById("back");
    backBtn.onclick = handleBackBtn;
    loginBtn = document.getElementById("submit");
    loginBtn.onclick = handleLoginBtn;
}

function toTitleCase(word)
{
    let finalWord = word[0].toUpperCase + word.slice(1);
    return finalWord;
}

function handleLoginBtn()
{
    login(`${toTitleCase(username.value)}@ForgottenRealm.com`, toTitleCase(password.value));
}

function login(email, password)
{
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => 
    {
        // Signed in 
        const user = userCredential.user;
        user.split("@");
        player = user[0];
        alert(`Welcome ${player}!`);

        // Change login into their name, when click give logout button
    }).catch((error) => 
    {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Error! ${errorCode}: ${errorMessage}`);
    });
}

function handleBackBtn()
{
    let url = window.location.href.split("?");
    window.location.href= url[1];
}

init();