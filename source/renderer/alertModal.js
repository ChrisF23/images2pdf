let alertModal = new bootstrap.Modal(document.getElementById("alert-modal"), {});
function mostrarAlert(titulo, mensaje) {
    document.getElementById("title").innerHTML = titulo;
    document.getElementById("message").innerHTML = mensaje;
    alertModal.toggle();
}

module.exports = { mostrarAlert }