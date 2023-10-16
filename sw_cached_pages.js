const cacheName = 'v1';

const cacheAssets=[
  'index.html',
  'styles.css',
  'main.js'
]


self.addEventListener('install', e =>{
  console.log('service installed');
  // e.waitUntil(
  //   caches.open(cacheName)
  //   .then(cache => {
  //     console.log("service worker: cacheing files");
  //     cache.addAll(cacheAssets)
  //   })
  //   .then(()=> self.skipWaiting())
  // )
})

self.addEventListener('activate', e =>{
  console.log('service activated');
  //Remove  unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache!==cacheName){
            console.log("service worker: clearing whole cache");
            return caches.delete(cache);
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  console.log('service worker: fetching');
  e.respondWith(
    fetch(e.request)
    .then(res => {
      const resClone = res.clone();
      caches.open(cacheName)
      .then(cache => {
        cache.put(e.request,resClone)
      })
      return res;
    }).catch(err =>  caches.match(e.request).then(res => res))
  )
})