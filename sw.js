/* Popote : l'appli s'ouvre sans réseau ; les prix et la page viennent du réseau quand il est là. */
var V='popote-v1';
var SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','data/actions.json'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET') return;
  var url=new URL(req.url);
  if(url.origin!==self.location.origin){
    e.respondWith(caches.open(V).then(function(c){return c.match(req).then(function(hit){
      var net=fetch(req).then(function(res){if(res.ok||res.type==='opaque') c.put(req,res.clone());return res;}).catch(function(){return hit;});
      return hit||net;});}));
    return;
  }
  e.respondWith(fetch(req).then(function(res){
    if(res.ok){var copy=res.clone();caches.open(V).then(function(c){c.put(url.pathname.endsWith('/')?'./':req,copy);});}
    return res;
  }).catch(function(){return caches.match(req,{ignoreSearch:true}).then(function(hit){return hit||caches.match('index.html');});}));
});
