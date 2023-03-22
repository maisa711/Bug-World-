function SaveFile(inp) {
  const file = inp.files[0];
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function (event) {
      // this will then display a text file
      localStorage.setItem(inp.id, reader.result); // save contents to localStorage
      const uploadedFileContents = localStorage.getItem(inp.id);
      console.log(uploadedFileContents);
      var text = event.target.result;
      const lines = text.split("\n");
      const a = parseInt(lines[0]);
      const b = parseInt(lines[1]);

      var plusno = 0;
      var minusno = 0;

      let plusFound = false;
      let minusFound = false;
      const numLinesAfterSecondLine = lines.length - 2;
      // Verify number of lines after the second line

      if (numLinesAfterSecondLine == a) {
        console.log("correct number of rows");
      } else {
        console.log("incorrect number of rows");
      }
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim(); // Remove leading/trailing whitespaces

        // Verify first and last character of line is #
        if (line[0] !== "#" || line[line.length - 1] !== "#") {
          console.log("no outer border");
        }
        if (i === 2 || i === lines.length) {
          const samplecharacters = line.split(" ");
          if (samplecharacters.length !== b) {
            // There should be b characters separated by a space
            console.log("incorrect number of columns");
          }
          for (let j = 0; j < samplecharacters.length; j++) {
            if (samplecharacters[j] !== "#") {
              console.log("border error");
            }
          }
        }
        // Verify characters separated by space are valid
        if (i !== 2 && i !== lines.length - 1) {
          const characters = line.split(" ");
          if (characters.length !== b) {
            // There should be b characters separated by a space
            console.log("incorrect number of columns");
          }
          for (let j = 0; j < characters.length; j++) {
            if (i === 2 || i === lines.length - 1) {
              const characters = line.split(" ");
              for (let j = 0; j < characters.length; j++) {
                if (characters[j] !== "#" && characters.length != b) {
                  console.log("border error");
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
              if (characters[j - 1] === "+" || characters[j + 1] === "+") {
              } else {
                console.log("plus swarms not linked");
              }
            }

            if (characters[j] === "-") {
              if (characters[j - 1] === "-" || characters[j + 1] === "-") {
              } else {
                console.log("minus swarms not linked");
              }
            }

            if (!/^[\d#.+\\-]$/.test(character)) {
              // Only allow #, digits, ., +, -
              console.log("out of bounds");
            }
            if (character === "+") {
              hasPlus = true;
            } else if (character === "-") {
              hasMinus = true;
            } else if (/^[1-9]$/.test(character)) {
              // Verify that a number from 1 to 9 is separated by space
              if (j === 0 || j === characters.length - 1) {
                console.log("number out of bounds");
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
      }
      if (!plusFound || !minusFound) {
        //console.log("swarms missing");
      }

      localStorage.setItem(inp.id + "_w", a);
      localStorage.setItem(inp.id + "_h", b);
    },
    false
  );

  if (file) {
    reader.readAsText(file);
    const contents = reader.result;
    console.log("read content");
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

function saveBug(inp) {
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

      const lines = text.split("\r\n");

      // create an object to store the instructions
      let bugCode = {};

      // loop through each line of the instrucions, check if it is a valid instuction, and add it to the object
      lines.forEach((line, i) => {
        line = line.trim();

        // check if the line has commands or is it just a comment
        if (comment.test(line)) {
          throw "lack of commands"
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
            throw "incorrect syntax";
          }
        }
      });

      // check if the instructions link to a non-existent line

      let bugCodeLen = Object.keys(bugCode).length - 1;

      for (const [key, value] of Object.entries(bugCode)) {
        let nums = value.match(/\b\d+\b/g);

        nums.forEach((num) => {
          if (num > bugCodeLen) {
            throw "link to a non-existent line";
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
    },
    false
  );

  // reads the file as text
  if (file) {
    reader.readAsText(file);
  }
}
