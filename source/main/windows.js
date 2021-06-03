const { BrowserWindow } = require("electron");

let appWindow;
let alertWindow;

function createAppWindow() {
    appWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            spellcheck: false
        },
        width: 900,
        resizable: false
    });
    appWindow.loadFile("../renderer/index.html");

    // Configurar eventos aqui -> Ej: appWindow.on("...", funcion());
}

// ----------------------------------------
// Exportar

function getAppWindow() {
    if (appWindow == null) {
        createAppWindow();
    }
    return appWindow;
};

module.exports = { getAppWindow }