
// function to save game attributes to local storage
function saveGameAttr(key, value) {
    // get game attributes from local storage if it exists or create a new object
    // game Attributes is an object that contains all the game information such as map, bugs, file validity etc.
    let gameAttributes = JSON.parse(localStorage.getItem('game_attributes')) || {};

    // saves 
    if (key === 'valid' && !('valid' in gameAttributes) || key.includes("bug") || key.includes("attributes") && !(key in gameAttributes)) {
        gameAttributes[key] = value;
    }
    else if (key === 'valid' && 'valid' in gameAttributes || key.includes("bug") || key.includes("attributes") && key in gameAttributes) {
        gameAttributes[key] = { ...gameAttributes[key], ...value };
    }
    else {
        // Push the new data (whether it be an object or anything else) onto the array
        gameAttributes[key] = value;
    }

    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('game_attributes', JSON.stringify(gameAttributes));

    const game = JSON.parse(localStorage.getItem('game_attributes'));
    console.log(game);
    console.log(game.map);
}

// function to check if the names of the bugs is are the same
function isnNameInvalid(key, value) {
    let gameAttributes = JSON.parse(localStorage.getItem('game_attributes'));
    // if gameAttributes does not exist, return false meaning that the other bug file has not been uploaded yet
    if (gameAttributes === null) {
        return false;
    }
    else {
        // if the names are the same, return true meaning that the bugs have the same names
        let checkBug1 = key === 'bug1' && "bug2" in gameAttributes && value === gameAttributes['bug2'].color;
        let checkBug2 = key === 'bug2' && "bug1" in gameAttributes && value === gameAttributes['bug1'].color;
        if ( checkBug1 || checkBug2) {
            return true;
        }
    }
}