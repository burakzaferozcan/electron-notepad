const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("close", (e) => {
    e.preventDefault();

    const response = dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      buttons: ["Kaydet", "Kaydetme", "İptal"],
      defaultId: 0,
      cancelId: 2,
      title: "Değişiklikler Kaydedilsin mi?",
      message: "Değişiklikler kaydedilsin mi?",
    });

    if (response === 0) {
      dialog
        .showSaveDialog(mainWindow, {
          title: "Kaydet",
          defaultPath: "notlar.txt",
          filters: [
            { name: "Text Files", extensions: ["txt"] },
            { name: "All Files", extensions: ["*"] },
          ],
        })
        .then((result) => {
          if (!result.canceled) {
            const filePath = result.filePath;
            mainWindow.webContents.send("save-content", filePath);
          }
        });
    } else if (response === 1) {
      mainWindow.destroy();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("close-window", () => {
  mainWindow.destroy();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
