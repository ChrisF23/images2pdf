const { ipcRenderer } = require("electron");
const CONSTANTES = require("../consts");
// Acciones:
const { onSeleccionarImagenes } = require("./actions/seleccionarImagenes");

// ----------------------------------------
// Estado Inicial:
let cards = document.querySelector("#cards");                  // Contenedor de cards.
const btnAddImgs = document.getElementById("btn-add-imgs");    // Boton para agregar imagenes.
let cantidadImagenesRestantes = CONSTANTES.LIMITE_IMAGENES;         // Cantidad de imagenes restantes.
actualizarLimiteImagenes();

// ----------------------------------------
// Seleccionar Imagenes.
btnAddImgs.addEventListener("click", () => {
    ipcRenderer.send("seleccionar-imagenes", obtenerRutasActualesImagenes());
    // Evitar que el usuario presione el boton entre el momento en que la ventana de dialogo se cierra y se abre el modal. 
    desactivarBotones();
});

ipcRenderer.on("seleccionar-imagenes", (event, response) => {
    onSeleccionarImagenes(response);
    // Volver a activar los botones.
    activarBotones();
});

// ----------------------------------------
// Comun.

function desactivarBotones() { document.querySelectorAll("button").forEach(b => b.disabled = true) }

function activarBotones() { document.querySelectorAll("button").forEach(b => b.disabled = false) }

function obtenerCantidadActualImagenes() { return cards.children.length }

function obtenerRutasActualesImagenes() {
    let rutasActuales = [];
    for (const element of cards.querySelectorAll("[name='img']")) {
        rutasActuales.push(element.getAttribute("src"));
    }

    return rutasActuales;
}

function calcularPosiciones() {
    let total = obtenerCantidadActualImagenes();
    let counter = 1;

    for (const card of cards.children) {
        card.querySelector("[name='img-page']").innerHTML = `${counter} de ${total}`
        counter++;
    }
}

function actualizarLimiteImagenes() {
    cantidadImagenesRestantes = CONSTANTES.LIMITE_IMAGENES - obtenerCantidadActualImagenes();

    if (cantidadImagenesRestantes == CONSTANTES.LIMITE_IMAGENES) {
        document.getElementById("limit-imgs").innerHTML = `Seleccione hasta ${cantidadImagenesRestantes} imágenes.`;
        btnAddImgs.disabled = false;
    } else if (cantidadImagenesRestantes != 0) {
        document.getElementById("limit-imgs").innerHTML = `Seleccione hasta ${cantidadImagenesRestantes} imágenes.`;
        btnAddImgs.disabled = false;
    } else {
        document.getElementById("limit-imgs").innerHTML = "Limite de imágenes alcanzado.";
        btnAddImgs.disabled = true;
    }
}