const { ipcRenderer } = require("electron");

ipcRenderer.on("init", (event, title, message) => {
    document.getElementById("title").innerHTML = title;
    document.getElementById("message").innerHTML = message;
});

document.getElementById("button").addEventListener("click", () => ipcRenderer.send("cerrar-alert"));
