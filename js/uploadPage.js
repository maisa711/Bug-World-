function SaveFile(inp) {
    const file = inp.files[0];

    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        localStorage.setItem(inp.id, reader.result); // save contents to localStorage
      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  }

  function saveIterations(inp) {
    localStorage.setItem(inp.id, inp.value); // save contents to localStorage
  }

  function saveLog(inp) {
    localStorage.setItem(inp.id, inp.checked); // save contents to localStorage
  }
