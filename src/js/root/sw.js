(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('js/sw-toolbox.js');
  
  global.toolbox.options.debug = true;
  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
  
  toolbox.router.get('(.*)', toolbox.fastest, {
    cache: {
      name: 'svenskaVerb1',
      maxEntries: 10
    }
  });
  toolbox.precache([
    'index.html', 
    'css/main.css', 
    'js/blocking.min.js', 
    'js/nonblocking.min.js', 
    'svenska.json'
  ]);

})(self);