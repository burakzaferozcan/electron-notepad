const { ipcRenderer } = require("electron");
const fs = require("fs");

ipcRenderer.on("save-content", (event, filePath) => {
  const content = document.getElementById("editor").value;
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error("Dosya kaydedilemedi", err);
      return;
    }
    console.log("Dosya başarıyla kaydedildi.");
    ipcRenderer.send("close-window");
  });
});
