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
    templateUrl: 'client/views/home/home.html',
    controller: Ctrl
  });
});

//controller here just to make adminLTE work properly with angular
Ctrl.$inject = ['$timeout'];

function Ctrl($timeout) {
  console.log('ctrl');
  $timeout(function(){
    console.log('timeout');
    $.AdminLTE.layout.activate();
  });
}

})();
