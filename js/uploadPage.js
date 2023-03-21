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
                if (
                  characters[j - 1] === "+" ||
                  characters[j + 1] === "+"
                ) {
                } else {
                  console.log("plus swarms not linked");
                }
              }

              if (characters[j] === "-") {
                if (
                  characters[j - 1] === "-" ||
                  characters[j + 1] === "-"
                ) {
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