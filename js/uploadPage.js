// Description: This file contains the functions that are used to upload the files to the local storage
function SaveFile(inp) {
    const file = inp.files[0];

    // create a new FileReader object
    const reader = new FileReader();

    // add an event listener to deal with the file when the reader is done
    reader.addEventListener(
        "load",
        () => {
            // file validation goes here
            
            //save file to localStorage, key is the id of the input element
            localStorage.setItem(inp.id, reader.result);
        },
        false
    );

    // reads the file as text
    if (file) {
        reader.readAsText(file);
    }
}

// save number of iterations to localStorage, key is the id of the input element
function saveIterations(inp) {
    if (inp.value > 0 && !inp.value == "") {
        localStorage.setItem(inp.id, inp.value);
    }

}

// save log info to localStorage, key is the id of the input element
function saveLog(inp) {
    localStorage.setItem(inp.id, inp.checked);
}
