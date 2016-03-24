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
        const deferred = $q.defer(),
              user = Users.findOne(Meteor.userId(), { fields: {_id: 1} });

        resolve();
        return deferred.promise;

        function resolve() {
          if (user) {
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
