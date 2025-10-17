let registration = null;

function register_service_worker() {
    if('serviceWorker' in navigator) {
        window.navigator.serviceWorker.register('./sw.js', {scope: './'})
        .then(res => {
            registration = res;
            console.log("Service Worker successfully registered.");
        })
        .catch(err => {
            console.log("Could not register Service Worker.");
        });
    }
}

function unregister_service_worker() {
    navigator.serviceWorker.getRegistrations()
    .then(registrations => {
        registrations.forEach(registration => {
            registration.unregister();
            console.log("Service Worker Unregistered.");
        })
    })
    .catch(err => {
        console.log("Could not unregister service worker.");
    });
}

window.addEventListener('click',() => {
    fetch('./objet.jpg')
        .then(res => console.log('From script.js: ', res));
});

register_service_worker();
// unregister_service_worker();