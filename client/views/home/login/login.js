(function() {
'use strict';

angular
.module('fz.login', [])

.config(function ($stateProvider) {
  $stateProvider
  .state('home.login', {
    url: '/login',
    templateUrl: 'client/views/home/login/login.html',
    resolve: {
      auth: ($q) => {
        console.log('auth login');
        const deferred = $q.defer();

        resolve();
        return deferred.promise;

        function resolve() {
          if (Meteor.userId()) {
            deferred.reject({name: 'redirect'});
          }
          else {
            deferred.resolve();
          }
        }
      }
    }
  });
});


})();
