const fs = require("fs");
const path = require("path");

// Plantilla para cards
let cardTemplate = fs.readFileSync(path.resolve(__dirname, "../components/card.html"));
const { mostrarAlert, mostrarAlertConfirmarQuitarCard } = require("../alertModal");

function onSeleccionarImagenes(response) {
    let tieneAdvertencia = false;

    switch (response.status) {
        case "error":
            mostrarAlert("Error", response.message);
            break;
        case "warning":
            tieneAdvertencia = true;
            
        case "ok":
            const imagenesSeleccionadas = response.data;
            if (imagenesSeleccionadas === undefined || !Array.isArray(imagenesSeleccionadas)) {
                mostrarAlert("Error", "Error inesperado.");
                break;
            }

            imagenesSeleccionadas.forEach(ruta => {
                // rutasGuardadas.push(ruta);
                crearCard(ruta)
            });
            
            if (tieneAdvertencia) mostrarAlert("Advertencia", response.message);
            break;
        default:
            mostrarAlert("Error", "El estatus de la respuesta no fue OK, WARNING o ERROR.");
            break;
    }
}

function crearCard(ruta) {
    // Crear el card y agregarlo al contenedor
    let card = document.createElement("div");
    card.className = "col";
    card.innerHTML = cardTemplate;
    cards.appendChild(card);

    // Escribir datos
    card.querySelector("[name='img-name']").innerHTML = path.basename(ruta);
    card.querySelector("[name='img']").src = ruta;
    card.querySelector("[name='btn-remove']").addEventListener("click", (e1) => {
        mostrarAlertConfirmarQuitarCard(card, (e2) => {
            card.remove();
            actualizarVista();
        });
    });

    card.querySelector("[name='btn-left']").addEventListener("click", (e1) => {
        let _cards = Array.from(cards.children);
        let index = _cards.indexOf(card);
        
        if (index == -1) { alert("Error inesperado"); }

        // Evitar mover la primera card a la izquierda
        if (index == 0) {
            alert("No se puede mover la primera card a la izquierda");
            return;
        }

        cards.insertBefore(card, cards.children[index - 1]);

        actualizarVista();
    });

    card.querySelector("[name='btn-right']").addEventListener("click", (e1) => {
        let _cards = Array.from(cards.children);
        let index = _cards.indexOf(card);
        
        if (index == -1) { alert("Error inesperado"); }

        // Evitar mover la primera card a la izquierda
        if (index == obtenerCantidadActualImagenes() - 1) {
            alert("No se puede mover la ultima card a la derecha");
            return;
        }

        cards.insertBefore(card, cards.children[index + 2]);

        actualizarVista();
    });
}

module.exports = {
    onSeleccionarImagenes
}