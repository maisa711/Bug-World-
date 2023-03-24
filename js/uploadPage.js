// function for map upload and validation
function SaveFile(inp) {
  // get error message, error text and success message elements
  const errorMessage = document.getElementById('error-message-map');
  const errortxt = document.getElementById('error-txt-map');
  const successMessage = document.getElementById('success-message-map');

  // get the file from the input element
  const file = inp.files[0];

  // create a new FileReader object
  const reader = new FileReader();

  // add an event listener to deal with the file when the reader is done
  reader.addEventListener(
    "load",

    function (event) {
      // get the text from the file
      let text = reader.result;

      // split the text into lines
      const lines = text.split("\n");
      let errortext = "An error occured";
      const a = parseInt(lines[1]); //height or num of rows
      const b = parseInt(lines[0]);  //width or num of column

      // number of +, - and food in the map
      let plusno = 0;
      let minusno = 0;
      let foodSum = 0;

      let hasError = false;
      const numLinesAfterSecondLine = lines.length - 2;
      // Verify number of lines after the second line
      if (numLinesAfterSecondLine == a) {
        console.log("correct number of rows");
      } else {
        errortext = "Incorrect height. Correct and upload again";
      }
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim(); // Remove leading/trailing whitespaces

        // Verify first and last character of line is #
        if (line[0] !== "#" || line[line.length - 1] !== "#") {
          errortext = "Outer border error. Correct and upload again";
          hasError = true;
        }
        if (i === 2 || i === lines.length) {
          const samplecharacters = line.split(" ");
          if (samplecharacters.length !== b) {
            // There should be b characters separated by a space
            errortext = "Incorrect width. Correct and upload again";
            hasError = true;
          }
          for (let j = 0; j < samplecharacters.length; j++) {
            if (samplecharacters[j] !== "#") {
              errortext = "Border error. Correct and upload again";
              hasError = true;
            }
          }
        }
        // Verify characters separated by space are valid
        if (i !== 2 && i !== lines.length - 1) {
          const characters = line.split(" ");
          for (let j = 0; j < characters.length; j++) {
            if (i === 2 || i === lines.length - 1) {
              const characters = line.split(" ");
              for (let j = 0; j < characters.length; j++) {
                if (characters[j] !== "#" && characters.length != b) {
                  errortext = "Border error. Correct and upload again";
                  hasError = true;
                }
              }
            }
            const character = characters[j];
            if (character == "+") {
              plusno++;
            }
            if (character == "-") {
              minusno++;
            }
            if (characters[j] === "+") {
              if (
                characters[j - 1] === "+" ||
                characters[j + 1] === "+"
              ) {
              } else {
                if (plusno > 1) {
                  errortext = "Swarm error. Correct and upload again";
                  hasError = true;
                }
              }
            }

            if (characters[j] === "-") {
              if (
                characters[j - 1] === "-" ||
                characters[j + 1] === "-"
              ) {
              } else {
                if (minusno > 1) {
                  errortext = "Swarm error. Correct and upload again";
                  hasError = true;
                }
              }
            }

            if (!/^[\d#.+\\-]$/.test(character)) {
              // Only allow #, digits, ., +, -
              errortext = "Value out of bounds. Correct and upload again";
              hasError = true;
            }

            if (/^[1-9]$/.test(character)) {
              foodSum += parseInt(character);
              // Verify that a number from 1 to 9 is separated by space
              if (j === 0 || j === characters.length - 1) {
                errortext = "Value out of bounds. Correct and upload again";
                hasError = true;
              }

            }
          }
        }
      }
      if (plusno === 0 || minusno === 0) {
        errortext = "Swarm error. Correct and upload again";
        hasError = true;
      }

      // if there is an error, display the error message, else display the success message
      if (hasError) {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'flex';
        errortxt.innerHTML = errortext;
        throw errortext;
      } else {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'flex';
      }

      let inpID = inp.id;
      
      // if there are no errors save the map, food, swarms and dimensions to game attributes in localStorage
      saveGameAttr("map_attributes", {"structure": text, "food": foodSum, "swarms": {"numBug1": plusno, "numBug2": minusno}, "height": a, "width": b});

      // add validation to make sure that the map is uploaded
      saveGameAttr("valid", {[inpID]: true});
    },
    false
  );

  // reads the file as text
  if (file) {
    reader.readAsText(file);
    const contents = reader.result;
    console.log("read content");
  }
}

// save number of iterations to localStorage, key is the id of the input element
function saveIterations(inp) {
  let inpID = inp.id;
  if (inp.value > 0 && !inp.value == "") {

    // save the number of iterations to game attributes in localStorage
    saveGameAttr(inpID, inp.value);

    // add validation to make sure that the number is entered
    saveGameAttr("valid", {[inpID]: true});
  }
  else{
    // if number is not entered, set validation to false
    saveGameAttr("valid", {[inpID]: false});
  }
}

// save log info to localStorage, key is the id of the input element
function saveLog(inp) {
  // save the log checkbox to game attributes in localStorage
  saveGameAttr(inp.id, inp.checked);
}

// function for saving bug code to localStorage and validating the code
function saveBug(inp) {
  // get error message, error text and success message elements
  const errorMessage = document.getElementById(`error-message-${inp.id}`);
  const errortxt = document.getElementById(`error-txt-${inp.id}`);
  const successMessage = document.getElementById(`success-message-${inp.id}`);

  let errortext = "An error occured";
  let hasError = false;

  // regex for each command, to determine the format of the commands
  // example of the sense command format
  // sense ahead 1 3 food; after semi-colon everything is a comment
  const sense = /^sense (here|ahead|leftahead|rightahead) \d+ \d+ (friend|foe|friendwithfood|foewithfood|food|rock|marker|foemarker|home|foehome);.*$/;
  const mark = /^mark \d+ \d+;.*$/;
  const unmark = /^unmark \d+ [\d+];.*$/;
  const pickup = /^pickup \d+ \d+;.*$/;
  const drop = /^drop \d+;.*$/;
  const turn = /^turn (left|right) \d+;.*$/;
  const move = /^move \d+ \d+;.*$/;
  const flip = /^flip \d+ \d+ \d+;.*$/;

  // regex if there is only a comment
  const comment = /^;.*$/;

  // get the file from the input element
  const file = inp.files[0];

  // create a new FileReader object
  const reader = new FileReader();

  // add an event listener to deal with the file when the reader is done
  reader.addEventListener(
    "load",
    function (event) {
      //grab file's text
      const text = reader.result;

      const lines = text.split("\n");

      // create an object to store the instructions
      let bugCode = {};

      // loop through each line of the instrucions, check if it is a valid instuction, and add it to the object
      lines.forEach((line, i) => {
        line = line.trim();

        // check if the line has commands or is it just a comment
        if (comment.test(line)) {
          errortext = "Lack of commands. Correct and upload again";
          hasError = true;
        } else {
          // check if the line has a valid format
          if (sense.test(line) || mark.test(line) || unmark.test(line) || pickup.test(line) || drop.test(line) || turn.test(line) || move.test(line) || flip.test(line)) {
            onlyComments = false;

            line = line.split(";");

            // get the instruction value
            let value = line[0];

            //if evething is good, add the instruction to the object
            // key is the index of the line and the value is the instruction
            bugCode[i] = value;
          } else {
            errortext = "Incorrect syntax. Correct and upload again";
            hasError = true;
          }
        }
      });

      // check if the instructions link to a non-existent line

      let bugCodeLen = Object.keys(bugCode).length - 1;

      for (const [key, value] of Object.entries(bugCode)) {
        let nums = value.match(/\b\d+\b/g);

        nums.forEach((num) => {
          if (num > bugCodeLen) {
            errortext = "Link to a non-existent line. Correct and upload again";
            hasError = true;
          }
        });
      }

      // get the file name
      let fileName = inp.value
        .split(/(\\|\/)/g)
        .pop()
        .split(".")[0];

      
      let inpID = inp.id;

      // check if the file name is the same as the other bug
      if (isnNameInvalid(inpID, fileName)) {
          errortext = "Bug1 and Bug2 can't have the same name. Correct and upload again";
          hasError = true;
      }

      // if there is an error, display the error message, else display the success message
      if (hasError) {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'flex';
        errortxt.innerHTML = errortext;
        throw errortext;
      } else {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'flex';
      }

      console.log("all good");

      // if there are no errors save the bug code and bug color to game attributes in localStorage
      saveGameAttr(inpID, {"code": JSON.stringify(bugCode), "color": fileName});

      // add validation to make sure that the bug code is uploaded
      saveGameAttr("valid", {[inpID]: true});
    },
    false
  );

  // reads the file as text
  if (file) {
    reader.readAsText(file);
  }

}

// function to make sure that all the files are uploaded and proceed to the next page
function uploadFiles() {
  console.log("uploading files");
  let gameAttributes = JSON.parse(localStorage.getItem('game_attributes')) || null;

  let gameAttrValid = !(gameAttributes === null); // check if gameAttributes exists
  let validObjInGameAttr = 'valid' in gameAttributes; // check if valid object exists in gameAttributes
  let allFilesUploaded = Object.values(gameAttributes.valid).every(item => item === true); // check if all files are uploaded
  let checkLength = Object.keys(gameAttributes.valid).length === 4; // in our case we only need to check for the map, bug1, bug2 and number of attributes

  // if all the conditions are met, proceed to the game page
  if (gameAttrValid && validObjInGameAttr && allFilesUploaded && checkLength) {
      window.location.href = 'mainPage.html';
  }
}