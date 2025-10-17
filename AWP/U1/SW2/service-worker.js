//Nombre de la cache
const cacheName= 'mi-cache-v2';

//Archivos que se guardaran en cache
const cacheAssets = [
    'index.html',
    'pagina1.html',
    'pagina2.html',
    'offline.html',
    'styles.css',
    'main.js',
    'icono.png'
];

//instalar del service worker
self.addEventListener('install', (event)=> {
    console.log("SW: Instalando");
    event.waitUntil(
        caches.open(cacheName).then((cache)=> {
            console.log("SW: Cacheando archivos...");
            return   cache.addAll(cacheAssets);
        })
        .then(()=> self.skipWaiting())
        .catch((err)=> console.log("Error al cachear archivos", err))
    );
});

//activacion del service worker
self.addEventListener('activate', (event)=> {
    console.log("SW: Activado");
    event.waitUntil(
        caches.keys().then((cacheNames)=> {
            return Promise.all(
                cacheNames.map((Name)=> {
                    if (Name !== cacheName) {
                        console.log(`SW: Eliminando cache antigua: ${cache}`);
                        return caches.delete(Name);
                    }
                })
            );
        })
    );
});

//Escuchar mensajes desde la pagina
self.addEventListener('message', (event)=> {
    console.log('SW: recibio', event.data);
    if (event.data === 'mostrar-notificacion') {
        self.registration.showNotification('Notificacion local', {
            body: 'Esta es una prueba sin servidor push.',
            icon: 'icono.png',
        });
    }
});

//manejar peticiones de red con fallback offline
self.addEventListener('fetch', (event)=> {
    //ignorar peticiones innecesarias como extrenciones o favicon
    if (event.request.url.includes('chrome-extension') || event.request.url.includes('favicon.ico')) {
        return;
    }
    event.respondWith(
        fetch(event.request).then((response)=> {
            //si la respuesta es valida la devuelve y la guarda en el cache dinamico
            const clone = response.clone();
            caches.open(cacheName).then((cache)=> cache.put(event.request, clone));
                return response;

            })
        .catch(()=> {
            //si no hay red intenta buscar en cache
            return caches.match(event.request).then((response)=> {
                if (response) {
                    console.log("SW: Recurso desde el cache", event.request.url);
                    return response;
                } else {
                    console.warn('SW: Mostrando pagina offline');
                    return caches.match('offline.html');
                }
            });
        })
    );
});