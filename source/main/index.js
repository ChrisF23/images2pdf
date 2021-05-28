const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");

const CONSTANTES = require("../consts");

let appWindow;

app.whenReady().then(() => { 
    appWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            spellcheck: false
        },
        width: 900,
        resizable: false
    });

    appWindow.loadFile("../renderer/index.html")
});



ipcMain.on("seleccionar-imagenes", async (event, rutasGuardadas) => {
    const rutasImagenes = await dialog.showOpenDialog(appWindow, {
        properties: ["openFile", "multiSelections", "dontAddToRecent"],
        filters: [{ name: "Imagenes", extensions: ["jpg", "png"] }]
    });

    // Si se canceló la selección de imagenes
    if (rutasImagenes.canceled || (Array.isArray(rutasImagenes.filePaths) && !rutasImagenes.filePaths.length)) {
        console.log("No se seleccionaron imagenes");
        openAlertWindow("Error", "No se seleccionaron imágenes.");
        return;
    }

    // Si la suma de las imagenes actuales y las seleccionadas supera el limite
    if (rutasImagenes.filePaths.length + rutasGuardadas.length > CONSTANTES.LIMITE_IMAGENES) {
        console.log(`Se seleccionaron ${rutasImagenes.filePaths.length} imagenes; Solo puede trabajar con hasta ${CONSTANTES.LIMITE_IMAGENES} imagenes.`);
        openAlertWindow("Error", `Se seleccionaron ${rutasImagenes.filePaths.length} imágenes.<br>Solo puede trabajar con hasta ${CONSTANTES.LIMITE_IMAGENES} imágenes.`);
        return;
    }

    // Si existen imagenes repetidas
    let rutasImagenesFiltradas = rutasImagenes.filePaths.filter(rutaSeleccionada => rutasGuardadas.indexOf(rutaSeleccionada) === -1);
    let rutasImagenesDescartadas = rutasImagenes.filePaths.filter(rutaSeleccionada => rutasGuardadas.indexOf(rutaSeleccionada) !== -1);
    
    const textoExtraImagenesDescartadas = rutasImagenesDescartadas.length > 5 ? `<li class="small">...(+${rutasImagenesDescartadas.length - 5} imágenes)</li></ul>` : "";
    
    if (rutasImagenes.filePaths.length !== rutasImagenesFiltradas.length) {
        console.log(`Se seleccionaron ${rutasImagenesFiltradas.length} imagenes; Se descartaron ${rutasImagenesDescartadas.length} imagenes.`);

        if (rutasImagenesFiltradas.length == 0) {
            openAlertWindow("Error", 
                `Se seleccionaron ${rutasImagenes.filePaths.length} imágenes, pero fueron descartadas.<br>`+
                `Se descartaron las siguientes imágenes duplicadas (${rutasImagenesDescartadas.length}):<br><ul>`+
                rutasImagenesDescartadas.map((value, index) => {
                    if (index < 5)
                        return `<li class="small">${path.basename(value)}</li>`;
                    return null;
                }).join("") + textoExtraImagenesDescartadas
            );
    
            return;
        }
        
        event.sender.send("seleccionar-imagenes", rutasImagenesFiltradas);
        openAlertWindow("Aviso", 
            `Se seleccionaron ${rutasImagenes.filePaths.length} imágenes, pero solo se agregaron ${rutasImagenesFiltradas.length}.<br>`+
            `Se descartaron las siguientes imágenes duplicadas (${rutasImagenesDescartadas.length}):<br><ul>`+
            rutasImagenesDescartadas.map((value, index) => {
                if (index < 5)
                    return `<li class="small">${path.basename(value)}</li>`;
                return null;
            }).join("") + textoExtraImagenesDescartadas
        );
        return;
    }

    console.log(`Se seleccionaron ${rutasImagenesFiltradas.length} imagenes.`);
    event.sender.send("seleccionar-imagenes", rutasImagenesFiltradas);
});

let alert;

ipcMain.on("cerrar-alert", (event) => alert.close());
function openAlertWindow(title, message) {
    alert = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }, parent: appWindow, modal: true, frame: false, width: 500, height: 360, resizable: false
    });
    alert.loadFile("../renderer/alert.html");

    alert.once('ready-to-show', () => alert.show());
    alert.on("close", () => appWindow.focus());
    alert.webContents.on("dom-ready", () => alert.webContents.send("init", title, message));
}