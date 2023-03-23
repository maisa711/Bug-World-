
function SaveFile(inp) {
  const errorMessage = document.getElementById('error-message1');
  const errortxt = document.getElementById('errortxt1');
  const successMessage = document.getElementById('success-message1');
  const file = inp.files[0];
  // create a new FileReader object
  const reader = new FileReader();

  // add an event listener to deal with the file when the reader is done
  reader.addEventListener(
    "load",

    function (event) {
      // this will then display a text file
      localStorage.setItem(inp.id, reader.result); // save contents to localStorage
      const uploadedFileContents = localStorage.getItem(inp.id);
      console.log(uploadedFileContents);
      var text = event.target.result;
      const lines = text.split("\n");
      var errortext = "An error occured";
      const a = parseInt(lines[1]); //height or num of rows
      const b = parseInt(lines[0]);  //width or num of column
      var plusno = 0;
      var minusno = 0;
      let plusFound = false;
      let minusFound = false;
      let hasError = false;
      const numLinesAfterSecondLine = lines.length - 2;
      // Verify number of lines after the second line
      if (numLinesAfterSecondLine == a) {
        console.log("correct number of rows");
      } else {
        console.log("incorrect number of rows");
        errortext = "Incorrect height. Correct and upload again";
      }
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim(); // Remove leading/trailing whitespaces

        // Verify first and last character of line is #
        if (line[0] !== "#" || line[line.length - 1] !== "#") {
          console.log("no outer border");
          errortext = "Outer border error. Correct and upload again";
          hasError = true;
        }
        if (i === 2 || i === lines.length) {
          const samplecharacters = line.split(" ");
          if (samplecharacters.length !== b) {
            // There should be b characters separated by a space
            console.log("Incorrect number of columns");
            errortext = "Incorrect width. Correct and upload again";
            hasError = true;
          }
          for (let j = 0; j < samplecharacters.length; j++) {
            if (samplecharacters[j] !== "#") {
              console.log("border error");
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
                  console.log("border error");
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
                  console.log("plus swarms not linked");
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
                  console.log("minus swarms not linked");
                  errortext = "Swarm error. Correct and upload again";
                  hasError = true;
                }
              }
            }

            if (!/^[\d#.+\\-]$/.test(character)) {
              // Only allow #, digits, ., +, -
              console.log("out of bounds");
              errortext = "Value out of bounds. Correct and upload again";
              hasError = true;
            }
            if (character === "+") {
              hasPlus = true;
            } else if (character === "-") {
              hasMinus = true;
            } else if (/^[1-9]$/.test(character)) {
              // Verify that a number from 1 to 9 is separated by space
              if (j === 0 || j === characters.length - 1) {
                console.log("number out of bounds");
                errortext = "Value out of bounds. Correct and upload again";
                hasError = true;
              }
              /*
           const previousCharacter = characters[j - 1];
            const nextCharacter = characters[j + 1];
            if (previousCharacter !== '.' && previousCharacter !== '-') {
              console.log("spacing error");
            }
            if (nextCharacter !== '.' && nextCharacter !== '+') {
              console.log("spacing error");
            }*/
            } else {
              // Any other character separated by space is considered an error
              // console.log("ou of bounds");
            }
          }
        }
      }
      if (plusno === 0 || minusno === 0) {
        console.log("swarm error");
        errortext = "Swarm error. Correct and upload again";
        hasError = true;
      }
      if (!plusFound || !minusFound) {
        //console.log("swarms missing");
      }
      if (hasError) {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'flex';
        errortxt.innerHTML = errortext;
      } else {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'flex';
      }
    },
    false
  );
  // reads the file as text
  if (file) {
    reader.readAsText(file);
    const contents = reader.result;
    console.log("read content");
  }
  inp.value = '';
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

function saveBug1(inp) {
  const errorMessage2 = document.getElementById('error-message2');
  const errortxt2 = document.getElementById('errortxt2');
  const successMessage2 = document.getElementById('success-message2');
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
  let hasError1 = false;

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
          hasError1 = true;
          //   throw "lack of commands"
        } else {
          // check if the line has a vaild format
          if (sense.test(line) || mark.test(line) || unmark.test(line) || pickup.test(line) || drop.test(line) || turn.test(line) || move.test(line) || flip.test(line)) {
            onlyComments = false;

            line = line.split(";");

            // get the instruction value
            let value = line[0];

            //if evething is good, add the instruction to the object
            // key is the index of the line and the value is the instruction
            bugCode[i] = value;
          } else {
            hasError1 = true;
            console.log("incorrect syntax");
            //     throw "incorrect syntax";
            console.log(hasError1);
          }
        }
      });

      // check if the instructions link to a non-existent line

      let bugCodeLen = Object.keys(bugCode).length - 1;

      for (const [key, value] of Object.entries(bugCode)) {
        let nums = value.match(/\b\d+\b/g);

        nums.forEach((num) => {
          if (num > bugCodeLen) {
            hasError1 = true;
           // throw "link to a non-existent line";
          }
        });
      }

      console.log("all good");

      // get the file name
      let fileName = inp.value
        .split(/(\\|\/)/g)
        .pop()
        .split(".")[0];

      //save file to localStorage, key is the id of the input element
      //object is converted to a string
      //to convert back to an object, use JSON.parse(object)
      localStorage.setItem(fileName + "_bug", JSON.stringify(bugCode));
      console.log(JSON.parse(localStorage.getItem("Red_bug")));
      if (hasError1) {
        console.log("here");
        successMessage2.style.display = 'none';
        errorMessage2.style.display = 'flex';
        errortxt2.innerHTML = "Error with bug code file";
      } else {
        errorMessage2.style.display = 'none';
        successMessage2.style.display = 'flex';
      }
    },
    false
  );

  // reads the file as text
  if (file) {
    reader.readAsText(file);
  }

  inp.value = '';

}
function saveBug2(inp) {
  const errorMessage3 = document.getElementById('error-message3');
  const errortxt3 = document.getElementById('errortxt3');
  const successMessage3 = document.getElementById('success-message3');
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
  let hasError2 = false;

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
          hasError2 = true;
          //   throw "lack of commands"
        } else {
          // check if the line has a vaild format
          if (sense.test(line) || mark.test(line) || unmark.test(line) || pickup.test(line) || drop.test(line) || turn.test(line) || move.test(line) || flip.test(line)) {
            onlyComments = false;

            line = line.split(";");

            // get the instruction value
            let value = line[0];

            //if evething is good, add the instruction to the object
            // key is the index of the line and the value is the instruction
            bugCode[i] = value;
          } else {
            hasError2 = true;
            console.log("incorrect syntax");
            //     throw "incorrect syntax";
          }
        }
      });

      // check if the instructions link to a non-existent line

      let bugCodeLen = Object.keys(bugCode).length - 1;

      for (const [key, value] of Object.entries(bugCode)) {
        let nums = value.match(/\b\d+\b/g);

        nums.forEach((num) => {
          if (num > bugCodeLen) {
            hasError2 = true;
           // throw "link to a non-existent line";
          }
        });
      }

      console.log("all good");

      // get the file name
      let fileName = inp.value
        .split(/(\\|\/)/g)
        .pop()
        .split(".")[0];

      //save file to localStorage, key is the id of the input element
      //object is converted to a string
      //to convert back to an object, use JSON.parse(object)
      localStorage.setItem(fileName + "_bug", JSON.stringify(bugCode));
      console.log(JSON.parse(localStorage.getItem("Red_bug")));
      if (hasError2) {
        console.log("here");
        successMessage3.style.display = 'none';
        errorMessage3.style.display = 'flex';
        errortxt3.innerHTML = "Error with bug code file";
      } else {
        errorMessage3.style.display = 'none';
        successMessage3.style.display = 'flex';
      }
    },
    false
  );

  // reads the file as text
  if (file) {
    reader.readAsText(file);
  }

  inp.value = '';

}
