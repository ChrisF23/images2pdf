// Plantilla para cards
let cardTemplate = fs.readFileSync(path.resolve(__dirname, "../components/card.html"));
const { mostrarAlert } = require("../alertModal");

function onSeleccionarImagenes(response, rutasGuardadas) {
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
                rutasGuardadas.push(ruta);
                crearCard(ruta)
            });

            if (tieneAdvertencia) mostrarAlert("Advertencia", response.message);

            return rutasGuardadas;

        default:
            mostrarAlert("Error", "El estatus de la respuesta no fue OK, WARNING o ERROR.");
            break;
    }
    return null;
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
}

module.exports = {
    onSeleccionarImagenes
}