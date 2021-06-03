let alertModal = document.getElementById("alert-modal");
let alertModalBS = new bootstrap.Modal(alertModal, {});

let removeCardModal = document.getElementById("remove-card-modal");
let removeCardModalBS = new bootstrap.Modal(removeCardModal, { keyboard: false });

function mostrarAlert(titulo, mensaje) {
    alertModal.querySelector("[name='title']").innerHTML = titulo;
    alertModal.querySelector("[name='message']").innerHTML = mensaje;
    alertModalBS.toggle();
}

function mostrarAlertConfirmarQuitarCard(card, listener) {
    removeCardModal.querySelector("[name='title']").innerHTML = "Quitar Imagen";
    removeCardModal.querySelector("[name='message']").innerHTML =
        'Esta seguro que desea quitar la imagen <span class="fst-italic">' + card.querySelector("[name='img-name']") + '</span>?';

    removeCardModal.querySelector("[name='confirm']").removeEventListener("click", listener)
    removeCardModal.querySelector("[name='confirm']").addEventListener("click", listener);
    removeCardModalBS.toggle();
}

module.exports = { mostrarAlert, mostrarAlertConfirmarQuitarCard }