const { ipcRenderer } = require("electron");
const path = require("path");
const fs = require('fs');
const CONSTANTES = require("../consts");

let rutasGuardadas = []; 

// Plantilla para cards
let template = fs.readFileSync(path.resolve(__dirname, "./components/card.html"));

// Contenedor de cards
let cards = this.document.querySelector("#cards");

// Boton para agregar imagenes
const btnAddImgs = this.document.getElementById("btn-add-imgs");

let limiteImagenes = CONSTANTES.LIMITE_IMAGENES;
actualizarLimiteImagenes();

// ----------------------------------------
// Seleccionar Imagenes.
btnAddImgs.addEventListener("click", async () => ipcRenderer.send("seleccionar-imagenes", rutasGuardadas));
ipcRenderer.on("seleccionar-imagenes", (event, imagenesSeleccionadas) => {
    if (imagenesSeleccionadas === undefined || !Array.isArray(imagenesSeleccionadas)) {
        alert("Error");
        return;
    }

    imagenesSeleccionadas.forEach(ruta => {
        rutasGuardadas.push(ruta);
        crearCard(ruta)
    });
    calcularPosiciones();

    limiteImagenes -= imagenesSeleccionadas.length;
    actualizarLimiteImagenes();
});

// ----------------------------------------
// UI
function crearCard(filePath) {
    // Crear el card y agregarlo al contenedor
    let card = document.createElement("div");
    card.className = "col";
    card.innerHTML = template;
    cards.appendChild(card);

    // Escribir datos
    card.querySelector("[name='img-name']").innerHTML = path.basename(filePath);
    card.querySelector("[name='img']").src = filePath;
}

function calcularPosiciones() {
    let total = cards.children.length;
    let counter = 1;

    for (const card of cards.children) {
        card.querySelector("[name='img-page']").innerHTML = `${counter} de ${total}`
        counter++;
    }
}

function actualizarLimiteImagenes() {
    if (limiteImagenes != 0) {
        document.getElementById("limit-imgs").innerHTML = `Seleccione hasta ${limiteImagenes} imágenes.`;
        btnAddImgs.disabled = false;
    } else {
        document.getElementById("limit-imgs").innerHTML = "Limite de imágenes alcanzado.";
        btnAddImgs.disabled = true;
    }
}