// gameStats is an array of objects that contains the title, id and value of game statistic
let gameStats = [
    {
        title: "Iterations",
        id: "iteration-count",
        value: "200/500",
    },
    {
        title: "Amount of undetected food",
        id: "undetected-food",
        value: "20",
    },
    {
        title: "Red bugs Remaining",
        id: "red-bugs-left",
        value: "5",
    },
    {
        title: "Red bugs Killed",
        id: "red-bugs-killed",
        value: "19",
    },
    {
        title: "Food Brought home by red bugs",
        id: "red-brought-food",
        value: "4",
    },
    {
        title: "Black bugs Remaining",
        id: "black-bugs-left",
        value: "7",
    },
    {
        title: "Black bugs Killed",
        id: "black-bugs-killed",
        value: "8",
    },
    {
        title: "Food Brought home by black bugs",
        id: "black-brought-food",
        value: "9",
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