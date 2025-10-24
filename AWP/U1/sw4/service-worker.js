// Nombre de caches (versionado simple)
const STATIC_CACHE = "sw4-static-v1";
const DYNAMIC_CACHE = "sw4-dynamic-v1";

// Archivos que se guardarán en caché (precarga)
const cacheAssets = [
    "./",               // raíz de SW4 (opcional si ya incluyes index explícito)
    "index.html",
    "pagina1.html",
    "pagina2.html",
    "pagina3.html",
    "styles.css",
    "main.js",
    "service-worker.js",
    "imagen1.jpg",
    "imagen2.jpg",
    "imagen3.jpg",
    "logo.png"
];

// Instalación: precache de assets estáticos
self.addEventListener("install", (event) => {
    console.log("SW4: Instalando...");
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log("SW4: Cacheando assets estáticos...");
                return cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.log("SW4: Error al cachear assets:", err))
    );
});

// Activación: limpieza de caches viejos y toma de control
self.addEventListener("activate", (event) => {
    console.log("SW4: Activado.");
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
                        console.log(`SW4: Eliminando cache viejo: ${key}`);
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// Mensajes desde la página (para notificaciones locales)
self.addEventListener("message", (event) => {
    // console.log("SW4: Mensaje recibido:", event.data);
    if (event.data === "mostrar-notificacion") {
        // Mostrar notificación local desde el SW (aparece en Centro de Notificaciones de Windows)
        self.registration.showNotification("Fotografía: ¡lista para disparar!", {
            body: "Notificación local sin servidor push. ¡Captura el momento!",
            icon: "logo.png",
            // badge opcional (blanco/negro 72x72): badge: "logo.png",
            vibrate: [50, 50, 50],
            tag: "fotografia-sw4",
            renotify: false
        });
    }
});

// Estrategia NETWORK-FIRST con fallback a CACHÉ y caché dinámico
self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Ignorar peticiones que no sean GET o de esquemas no cacheables
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.protocol.startsWith("chrome-extension")) return;

    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                // Si la respuesta de red es válida, guardar en caché dinámico
                if (networkResponse && networkResponse.status === 200) {
                    const respClone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, respClone));
                }
                // Devolver siempre lo más fresco
                return networkResponse;
            })
            .catch(() => {
                // Sin red: intentar desde cualquier caché (estático o dinámico)
                return caches.match(request).then((cached) => {
                    if (cached) {
                        return cached;
                    }
                    // Sin offline.html en SW4 por enunciado; si quisieras, aquí podrías retornar una reserva.
                    return Promise.reject("SW4: Recurso no disponible offline y no está en caché.");
                });
            })
    );
});
