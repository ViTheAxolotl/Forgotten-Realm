var params = document.body.getElementsByTagName('script');
var query = params[0].classList;
var parentFolder = query[0];

var imageLocation;
var jsaLocation;
var mainLocation;

if(parentFolder == "noParent")
{
    mainLocation = "";
    imageLocation = "images/"
}

document.write(
'<div class="container-fluid">' +
    '<a class="navbar-brand" href="' + mainLocation + 'index.html"><img src = "'+ imageLocation +'UP.png" title = "Aqua Hydrocity" alt = "Aqua Hydrocity" width = "70" height = "70"/></a>'+
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">' +
        '<span class="navbar-toggler-icon"></span>' +
    '</button>' +
    '<div class="collapse navbar-collapse" id="navbarSupportedContent"> ' +
        '<ul class="navbar-nav me-auto my-2 my-lg-0 " style="--bs-scroll-height: 100px;"> ' +
            '<li class="nav-item"><a class="nav-link active" aria-current="page" href="index.html">Unbalanced Powers</a></li>' +
            '<li class="nav-item dropdown">' +
                '<a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
                    'World Information' +
                '</a>' +
                '<ul class="dropdown-menu bg-dark" aria-labelledby="navbarScrollingDropdown">' +
                    '<li class="nav-item"><a class="nav-link active" aria-current="page" href="creationStory.html">Birth Of The Universe</a></li>' +
                    '<li class="nav-item"><a class="nav-link active" aria-current="page" href="calamity.html">The Calamity</a></li>' +
                    '<li class="nav-item"><a class="nav-link active" aria-current="page" href="deities.html">Deities</a></li>' +
                    '<li class="nav-item"><a class="nav-link active" aria-current="page" href="characters.html">Characters</a></li>' +
                '</ul>' +
            '</li>' +
            '<li class="nav-item"><a class="nav-link active" aria-current="page" href="mapAndTowns.html">Maps</a></li>' +
            '<li class="nav-item"><a class="nav-link active" aria-current="page" href="questAndNotes.html">Quests & Personal Notes</a></li>' + 
            '<li class="nav-item"><a class="nav-link active" aria-current="page" href="recap.html">Sessions Recap</a></li>' + 
            '<li class="nav-item"><a class="nav-link active" aria-current="page" href="itemIndex.html">Magic Item Index</a></li>' +    
        '</ul>' +
    '</div>' +
'</div>');