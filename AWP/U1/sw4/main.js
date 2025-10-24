// Registrar el Service Worker con el mismo tono que tus ejemplos previos
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./service-worker.js")
        .then((reg) => console.log("Service Worker registrado", reg))
        .catch((err) => console.log("Fallo el registro del Service Worker", err));
}

// Botón para verificar el estado del SW
document.getElementById("check").addEventListener("click", () => {
    if (navigator.serviceWorker.controller) {
        alert("El Service Worker está activo y controlando la página.");
    } else {
        alert("El Service Worker aún no controla esta pestaña. Recarga la página si acabas de instalarlo.");
    }
});

// Botón para solicitar permiso de notificaciones (bajo gesto del usuario)
document.getElementById("btnPermiso").addEventListener("click", async () => {
    if (!("Notification" in window)) {
        alert("Este navegador no soporta Notificaciones.");
        return;
    }
    try {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
            console.log("Permiso para notificaciones concedido");
            alert("Permiso concedido. Ahora puedes probar la notificación.");
        } else if (perm === "denied") {
            alert("Permiso de notificaciones denegado.");
        } else {
            alert("La solicitud de permisos fue descartada.");
        }
    } catch (e) {
        console.log("Error al solicitar permiso de notificaciones", e);
    }
});

// Botón para lanzar notificación local (vía el SW)
document.getElementById("btnNotificacion").addEventListener("click", async () => {
    if (!("Notification" in window)) return;

    // Verificar permiso
    if (Notification.permission !== "granted") {
        alert("Primero debes conceder permisos de notificación.");
        return;
    }

    // Verificar que el SW controle la página
    if (!navigator.serviceWorker.controller) {
        alert("El SW aún no controla esta pestaña. Recarga la página y vuelve a intentar.");
        return;
    }

    try {
        // Enviar mensaje al Service Worker para que muestre la notificación
        navigator.serviceWorker.controller.postMessage("mostrar-notificacion");
    } catch (e) {
        console.log("Error al comunicar con el Service Worker", e);
    }
});
