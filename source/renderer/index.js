const { ipcRenderer } = require("electron");
const CONSTANTES = require("../consts");
// Acciones:
const { onSeleccionarImagenes } = require("./actions/seleccionarImagenes");

// ----------------------------------------
// Estado Inicial:
let cards = this.document.querySelector("#cards");                  // Contenedor de cards.
const btnAddImgs = this.document.getElementById("btn-add-imgs");    // Boton para agregar imagenes.
let rutasGuardadas = [];                                            // Rutas de las imagenes agregadas.
let cantidadImagenesRestantes = CONSTANTES.LIMITE_IMAGENES;         // Cantidad de imagenes restantes.
actualizarLimiteImagenes();

// ----------------------------------------
// Seleccionar Imagenes.
btnAddImgs.addEventListener("click", () => {
    ipcRenderer.send("seleccionar-imagenes", rutasGuardadas);
    // Evitar que el usuario presione el boton entre el momento en que la ventana de dialogo se cierra y se abre el modal. 
    desactivarBotones();
});

ipcRenderer.on("seleccionar-imagenes", (event, response) => {
    let resultado = onSeleccionarImagenes(response, rutasGuardadas);
    // Volver a activar los botones.
    activarBotones();

    if (resultado == null) return;
    rutasGuardadas = resultado;

    calcularPosiciones();
    actualizarLimiteImagenes();
});

// ----------------------------------------
// Comun.

function desactivarBotones() { document.querySelectorAll("button").forEach(b => b.disabled = true) }

function activarBotones() { document.querySelectorAll("button").forEach(b => b.disabled = false) }

function obtenerCantidadActualImagenes() { return cards.children.length }

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