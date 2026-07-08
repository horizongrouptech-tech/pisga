const C="pisga-v5";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
});
self.addEventListener("push",e=>{
  let d={title:"מועדון הפסגה",body:"",url:"./"};
  try{d=Object.assign(d,e.data.json());}catch(_){if(e.data)d.body=e.data.text();}
  e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:"icon-192.png",badge:"favicon-32.png",dir:"rtl",lang:"he",data:{url:d.url||"./"}}));
});
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  const scope=self.registration.scope;
  // נעילה ל-scope של האפליקציה: url ישן/שגוי כמו "/" לא יזרוק ל-404 בשורש הדומיין
  let target=scope;
  try{const raw=(e.notification.data&&e.notification.data.url)||scope;const u=new URL(raw,scope);target=(u.href.indexOf(scope)===0)?u.href:scope;}catch(_){target=scope;}
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if(c.url&&c.url.indexOf(scope)===0&&"focus" in c)return c.focus();}
    if(clients.openWindow)return clients.openWindow(target);
  }));
});
