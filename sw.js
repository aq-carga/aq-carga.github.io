/* Plantel Pro - Lanus: guarda la app en el aparato para que abra sin internet.
   La pagina se pide primero a internet (asi llegan las versiones nuevas) y, si no hay conexion o tarda, se abre la guardada.
   (sin acentos a proposito: el archivo tiene que ser ASCII para que cualquier servidor lo entregue bien) */
var V='aq-carga-app-2026-11-09-1910',FILES=["./", "index.html", "diagnostico.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "favicon-64.png", "favicon.ico"];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('aq-carga-app-')===0&&k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(r.mode==='navigate'||/\.html$/.test(u.pathname)){
    var net=fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(u.pathname.endsWith('/')?'./':r,cp)})}return res});
    e.respondWith(new Promise(function(ok,no){var done=false,t=setTimeout(function(){caches.match(r,{ignoreSearch:true}).then(function(c){if(c&&!done){done=true;ok(c)}})},4000);
      net.then(function(res){if(!done){done=true;clearTimeout(t);ok(res)}},function(){caches.match(r,{ignoreSearch:true}).then(function(c){if(!done){done=true;clearTimeout(t);c?ok(c):no(new Error('sin conexion'))}})})}));
    return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(c){return c||fetch(r)}));
});
