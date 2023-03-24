function pageLoad() {
    // get the game attributes from local storage
    let gameAttributes = JSON.parse(localStorage.getItem('game_attributes')) || null;
    
    // if gameAttributes does not exist, redirect to the index page
    if (gameAttributes === null) {
        window.location.href = '../index.html';
    }
    
    let mapinfo = gameAttributes.map_attributes; // get map info
    let iterations = gameAttributes.numIterations; // get number of iterations
    let bug1 = gameAttributes.bug1; // get bug1 info
    let bug2 = gameAttributes.bug2; // get bug2 info

    // gameStats is an array of objects that contains the title, id and value of game statistic
    // certain values are updated based on the map info and iterations
    let gameStats = [
        {
            title: "Iterations",
            id: "iteration-count",
            value: `0/${iterations}`,
        },
        {
            title: "Amount of undetected food",
            id: "undetected-food",
            value: `${mapinfo.food}`,
        },
        {
            title: `${bug1.color} bugs Remaining`,
            id: "red-bugs-left",
            value: `${mapinfo.swarms.numBug1}`,
        },
        {
            title: `${bug1.color} bugs Killed`,
            id: "red-bugs-killed",
            value: "0",
        },
        {
            title: `Food Brought home by ${bug1.color} bugs`,
            id: "red-brought-food",
            value: "0",
        },
        {
            title: `${bug2.color} bugs Remaining`,
            id: "black-bugs-left",
            value: `${mapinfo.swarms.numBug2}`,
        },
        {
            title: `${bug2.color} bugs Killed`,
            id: "black-bugs-killed",
            value: "0",
        },
        {
            title: `Food Brought home by ${bug2.color} bugs`,
            id: "black-brought-food",
            value: "0",
        },
    ];
    // get the game stats div
    let gStat = document.getElementById("game-stats");

    // create a div including the title, id and value for each game statistic and append it to the game stats div
    gameStats.forEach((stat) => {
        const newDiv = document.createElement("div");
        const newStrong = document.createElement("strong");
        const newSpan = document.createElement("span");
        newStrong.innerHTML = stat.title;
        newSpan.innerHTML = stat.value;
        newSpan.id = stat.id;
        newDiv.appendChild(newStrong);
        newDiv.appendChild(newSpan);
        gStat.appendChild(newDiv);
    });
}

// function to open the module pop-up
function popup(btn) {
    // get the overlay and close button
    const overlay = document.getElementById(btn.id + "-popup");
    const closeBtn = overlay.querySelector("#close-btn");

    // Function to open the module pop-up
    function openModule() {
        overlay.style.display = "flex";
    }

    // Function to close the module pop-up
    function closeModule() {
        overlay.style.display = "none";
    }

    closeBtn.addEventListener("click", closeModule);
    openModule();
}

// function to load the options in the options pop-up
function loadOptions(btn) {
    console.log("load options");

    // get the game attributes from local storage
    let gameAttributes = JSON.parse(localStorage.getItem('game_attributes')) || null;

    let iterations = gameAttributes.numIterations; // get number of iterations
    let bug1 = gameAttributes.bug1; // get bug1 info
    let bug2 = gameAttributes.bug2; // get bug2 info
    
    // get the overlay
    const overlay = document.getElementById(btn.id + "-popup");
    
    // get all the elements in the options popup
    const bug1Color = overlay.querySelector("#change-bug-1"); 
    const bug2Color = overlay.querySelector("#change-bug-2");
    const numIter = overlay.querySelector("#num-iterations");
    const tickDur = overlay.querySelector("#tick-duration");

    // set the values of the elements to the values of the game attributes
    numIter.value = iterations;
    bug1Color.value = bug1.color;
    bug2Color.value = bug2.color;
    tickDur.value = 10;

    // open the popup
    popup(btn);
    
}


function saveOptions(btn){
    // saving the options should be done here
}

function quitGame(btn){
    // when the user is finished playing the game, the game attributes should be removed from local storage 
    // and the user should be redirected to the index page
    localStorage.clear();
    window.location.href='../index.html';
}