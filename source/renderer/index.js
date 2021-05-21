const { dialog } = require("electron").remote;
const path = require("path");
const fs = require('fs');

// Plantilla para cards
let template = fs.readFileSync(path.resolve(__dirname, "./components/card.html"));

// Contenedor de cards
let cards = this.document.querySelector("#cards");

// Boton para agregar imagenes
const btnAddImgs = this.document.getElementById("btn-add-imgs");

btnAddImgs.addEventListener("click", async () => {
    const imagesToAdd = await dialog.showOpenDialog({
            properties: ["openFile", "multiSelections", "dontAddToRecent"],
            filters: [{ name: "Imagenes", extensions: ["jpg", "png"] }]
        });

    // Si se canceló la selección de imagenes
    if (imagesToAdd.canceled || (Array.isArray(imagesToAdd.filePaths) && !imagesToAdd.filePaths.length)) {
        console.log("No se seleccionaron imagenes");
        return;
    }

    imagesToAdd.filePaths.forEach(filePath => crearCard(filePath));
    calcularPosiciones();
});


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

