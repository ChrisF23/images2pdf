const { app, BrowserWindow } = require("electron");
const ejse = require('ejs-electron')

app.whenReady().then(() => {
    const appWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            spellcheck: false,
            enableRemoteModule: true
        },
        width: 900,
        resizable: false
    });
    appWindow.loadFile("../renderer/index.html");
});