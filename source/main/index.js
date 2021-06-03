const { app, ipcMain } = require("electron");
const windows = require("./windows");

const seleccionarImagenes = require("./actions/seleccionarImagenes");

app.whenReady().then(() => windows.getAppWindow());

ipcMain.on("seleccionar-imagenes", async (event, rutasGuardadas) => await seleccionarImagenes(event, rutasGuardadas));