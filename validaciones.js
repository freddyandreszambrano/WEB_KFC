document.getElementById("form-contacto").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (nombre.length < 2) {
        alert("El nombre debe tener al menos 2 caracteres.");
        return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        alert("Ingrese un correo electrónico válido.");
        return;
    }

    if (mensaje.length < 10) {
        alert("El mensaje debe tener al menos 10 caracteres.");
        return;
    }

    alert("Formulario enviado correctamente.");
    this.reset();
});
