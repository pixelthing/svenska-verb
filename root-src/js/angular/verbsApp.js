var verbsApp = angular.module('verbsApp', ['ngAnimate','hmTouchEvents']).config(function($sceDelegateProvider) {
 $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'http://translate.google.com/**']);

});