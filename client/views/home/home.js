(function() {
'use strict';

angular
.module('fz.home', [
  'fz.login',
  'fz.finish-registration'
])

.config(function ($stateProvider) {
  $stateProvider
  .state('home', {
    url: '/home',
    abstract: true,
    templateUrl: 'client/views/home/home.html'
  });
});

})();
