toolbox.router.get('/index.html', toolbox.fastest);
toolbox.precache(['/index.html', '/css/main.css', '/js/blocking.js', '/js/nonblocking.js', '/svenska.json']);

(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/js/sw-toolbox.js');
  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);