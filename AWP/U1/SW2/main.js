//Registrar el service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then((reg)=> console.log("Service Worker registrado", reg))
    .catch((err)=> console.log("Fallo el registro del Service Worker", err));
}

//Boton para verifigar el estado del SW
document.getElementById("check").addEventListener("click", ()=> {
    if (navigator.serviceWorker.controller) {
        alert("El SW esta activo y controlando la pagina.");
    } else {
        alert("El SW no esta activo."); 
    }
});

//pedir permiso para las notificaciones
if (Notification.permission === 'default') {
    Notification.requestPermission().then((perm)=> {
        if (perm === 'granted') {
            console.log("Permiso para notificaciones concedido");
        } else {
            console.log("Permiso para notificaciones denegado.");
        }
     });
}

//Boton para lanzar notificacio  localn
document.getElementById("btnNotificacion").addEventListener("click", ()=> {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("mostrar-notificacion"); 
    } else {
        console.log("El service Worker no esta activo aun.");
    }
});
