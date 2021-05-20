const { app, BrowserWindow } = require("electron");

app.whenReady().then(() => {
    const appWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            spellcheck: false
        },
        resizable: false
    });
    appWindow.loadFile("../renderer/index.html");
});