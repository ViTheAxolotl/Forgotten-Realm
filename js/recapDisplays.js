"use strict";
function init()
{
    let characters = document.getElementsByTagName("button");

    for (let i = 1; i < characters.length - 1; i++) 
    {
        characters[i].onclick = handleCharacterButton;
    }

    characters[characters.length - 2].onclick = handleBringToTop;
    characters[characters.length - 1].onclick = handleReset;
}

function handleCharacterButton()
{
    let txtBox = document.getElementById("description");
    let nameTxt = document.getElementById("name");
    txtBox.innerHTML = charStories[this.id];
    nameTxt.innerHTML = expandName[this.id];
    document.getElementById("display").scrollIntoView({behavior: 'smooth'});
}

function handleBringToTop()
{
    document.getElementById("header").scrollIntoView({behavior: 'smooth'});
}

function handleReset()
{
    location.reload(true);
}

window.onload = init;

let charStories = 
{
    "ep1" : "We begin the campaign in The Dull Knife Bar. After everyone appeared/walked in, Prince Grado introduced himself and failed at getting to know the party. He then discussed the mission and gave the keys to the Holiday Inn rooms. The party drank a bit and argued about the galaxy and its meaning. After waking up they arrive at a rundown carriage pulled by 2 stallions. The party then took to the road. After a couple of hours, you take a break to eat by the lake. The Grado decides right now is a good time to swim. Stripping to his crown undies, he jumps into the water. Just in time to get ambushed by bandits. With Razor obliterating 2 of them, the battle went smoothly. Then some dreams and back to the road they went. As two giant bears with bones coming out of their bodies, with Nibbly pull vaulting techniques they were killed. But they took a horse down with them. The party then found out they were creatures called MagicVoid that hunger for magic. Arriving at the gates to Salatude, the party bullied the gateman. And got some shopping in before the ball, or should we say rave. Prince Thallos switched the theme to get his grinding on. After meeting some interesting people, a murder was discovered, now the party must find the killer so they can leave the ball.",
    "ep2" : "We started at the ball after the murders. The party was told by a guard if they turned in the culprit they would be paid. So they went to ask questions of the 4 suspects. After inspecting the bodies, they learned they were killed by magic. However, they didn't catch the murderer in time as he went to kill the prince. As one of the guards shot the fairy out of the air he dropped a crystal. The party then decided to start heading home and had some dreams. Then they went and got jumped by some bandits where Leonier & Razor went down for a spell. Grado after noticing how none of them fully died decided to offer them a job working for the castle. So they went to the castle, met some people, and got a cottage as long as they had a quest going. Some hijinks with Leoiner’s bed, and buying spices and food. And they settled in and slept. Wake up to find the job board has some jobs and got their team name ‘The Crimson Fatales’. Accepting both the missing people and MV attack quest and taking off after eating their free meal Nook attacks a waitress. On the road, they were offered a ride on a carriage and murdered all the bandits in sight."
};

let expandName =
{
    "ep1" : "Travels to Salatude",
    "ep2" : "The Crimson Fatales"
};