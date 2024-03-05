"use strict";

function init()
{
    navBarSetup();
    discordSetup();
    copyrightSetup();
}

function navBarSetup()
{
    var params = document.body.getElementsByTagName('script');
    var query = params[0].classList;
    var parentFolder = query[0];

    var imageLocation;
    var jsaLocation;
    var mainLocation;

    if(parentFolder == "noParent")
    {
        mainLocation = "";
        imageLocation = "images/";
    }

    if(parentFolder == "downOne")
    {
        mainLocation = "../";
        imageLocation = "../images/";
    }

    document.write(
    '<div class="container-fluid">' +
        '<a class="navbar-brand" href="' + mainLocation + 'index.html"><img src = "'+ imageLocation +'UP.png" title = "Unbalanced Powers" alt = "Unbalanced Powers" width = "70" height = "70"/></a>'+
        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">' +
            '<span class="navbar-toggler-icon"></span>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="navbarSupportedContent"> ' +
            '<ul class="navbar-nav me-auto my-2 my-lg-0 " style="--bs-scroll-height: 100px;"> ' +
                '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'index.html">Unbalanced Powers</a></li>' +
                '<li class="nav-item dropdown">' + 
                    '<a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
                        'World Information' +
                    '</a>' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="navbarScrollingDropdown">' +
                        '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'creationStory.html">Birth Of The Universe</a></li>' +
                        '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'calamity.html">The Calamity</a></li>' +
                        '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'deities.html">Deities</a></li>' +
                        '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'characters.html">Characters</a></li>' +
                    '</ul>' +
                '</li>' +
                '<li class="nav-item dropdown">' + 
                    '<a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
                        'Websites' +
                    '</a>' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="navbarScrollingDropdown">' +
                        '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'roll20.html">Roll 20</a></li>' +
                    '</ul>' +
                '</li>' +
                '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'mapAndTowns.html">Maps</a></li>' +
                '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'questAndNotes.html">Quests & Personal Notes</a></li>' + 
                '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'recap.html">Sessions Recap</a></li>' + 
                '<li class="nav-item"><a class="nav-link active" aria-current="page" href="' + mainLocation + 'itemIndex.html">Magic Item Index</a></li>' +    
            '</ul>' +
        '</div>' +
    '</div>');

    let section1 =
    {
        "Birth Of The Universe": "creationStory.html",
        "The Calamity": "calamity.html",
        "Deities": "deities.html",
        "Characters": "characters.html",
    }

    let section2 =
    {
        "Maps": "mapAndTowns.html",
        "Quest & Personal Notes": "questAndNotes.html",
        "Session Recaps": "recap.html",
        "Magic Item Index": "itemIndex.html",
        "Roll20": "roll20.html"
    }
}

function discordSetup()
{
    document.write
    (
        '<script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async defer>' +
            'new Crate('+
            '{' +
                'server: "1042157480463040613",' + 
                'channel: "1042157480463040616",' +
            '})' +
        '</script>' 
    );
}

function copyrightSetup()
{
    let footer = document.getElementById("footer");
    let copyright = document.createElement("h6");
    footer.appendChild(copyright);

    copyright.innerHTML = 'Copyright &copy; Vi Snyder ' + new Date().getFullYear() + ''; 
}

init();