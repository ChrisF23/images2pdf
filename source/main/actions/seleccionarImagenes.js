const path = require("path");
const { dialog } = require("electron");
const windows = require("../windows");
const CONSTANTES = require("../../consts");

module.exports = async function seleccionarImagenes(event, rutasGuardadas) {
    const rutasImagenes = await dialog.showOpenDialog(windows.getAppWindow(), {
        properties: ["openFile", "multiSelections", "dontAddToRecent"],
        filters: [{ name: "Imagenes", extensions: ["jpg", "png"] }]
    });

    // Si se canceló la selección de imagenes
    if (rutasImagenes.canceled || (Array.isArray(rutasImagenes.filePaths) && !rutasImagenes.filePaths.length)) {
        event.sender.send("seleccionar-imagenes", { status: "error", message: "No se seleccionaron imágenes." });

        console.log("No se seleccionaron imagenes");
        return;
    }

    // Si la suma de las imagenes actuales y las seleccionadas supera el limite
    if (rutasImagenes.filePaths.length + rutasGuardadas.length > CONSTANTES.LIMITE_IMAGENES) {
        event.sender.send("seleccionar-imagenes", {
            status: "error",
            message: `Se seleccionaron ${rutasImagenes.filePaths.length} imágenes.<br>Solo puede agregar ${CONSTANTES.LIMITE_IMAGENES - rutasGuardadas.length} imágenes más.`
        });

        console.log(`Se seleccionaron ${rutasImagenes.filePaths.length} imagenes; Solo puede agregar ${CONSTANTES.LIMITE_IMAGENES - rutasGuardadas.length} imagenes mas.`);
        return;
    }

    // Si existen imagenes repetidas
    let rutasImagenesFiltradas = rutasImagenes.filePaths.filter(rutaSeleccionada => rutasGuardadas.indexOf(rutaSeleccionada) === -1);
    let rutasImagenesDescartadas = rutasImagenes.filePaths.filter(rutaSeleccionada => rutasGuardadas.indexOf(rutaSeleccionada) !== -1);
    
    const textoExtraImagenesDescartadas = rutasImagenesDescartadas.length > 5 ? `<li class="small">...(+${rutasImagenesDescartadas.length - 5} imágenes)</li></ul>` : "";
    
    if (rutasImagenes.filePaths.length !== rutasImagenesFiltradas.length) {
        if (rutasImagenesFiltradas.length == 0) {
            event.sender.send("seleccionar-imagenes", {
                status: "error",
                message: `Se seleccionaron ${rutasImagenes.filePaths.length} imágenes, pero fueron descartadas.<br>`+
                    `Se descartaron las siguientes imágenes duplicadas (${rutasImagenesDescartadas.length}):<br><ul>`+
                    rutasImagenesDescartadas.map((value, index) => {
                        if (index < 5)
                            return `<li class="small">${path.basename(value)}</li>`;
                        return null;
                    }).join("") + textoExtraImagenesDescartadas
            });
        } else {
            event.sender.send("seleccionar-imagenes", {
                data: rutasImagenesFiltradas,
                status: "warning",
                message: `Se seleccionaron ${rutasImagenes.filePaths.length} imágenes, pero solo se agregaron ${rutasImagenesFiltradas.length}.<br>`+
                    `Se descartaron las siguientes imágenes duplicadas (${rutasImagenesDescartadas.length}):<br><ul>`+
                    rutasImagenesDescartadas.map((value, index) => {
                        if (index < 5) return `<li class="small">${path.basename(value)}</li>`;
                        return null;
                    }).join("") + textoExtraImagenesDescartadas
            });
        }

        console.log(`Se seleccionaron ${rutasImagenes.filePaths.length} imagenes; Se descartaron ${rutasImagenesDescartadas.length} imagenes.`);
        return
    }

    event.sender.send("seleccionar-imagenes", { data: rutasImagenesFiltradas, status: "ok" });
    console.log(`Se seleccionaron ${rutasImagenesFiltradas.length} imagenes.`);
}