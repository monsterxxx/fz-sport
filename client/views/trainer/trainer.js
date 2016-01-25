(function() {
'use strict';

angular
  .module('fz.trainer', [

  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('trainer', {
        url: '/trainer',
        templateUrl: 'client/views/trainer/trainer.html',
        resolve: {
          currentUser: ($q) => {
            var deferred = $q.defer();

            if (Meteor.user() == null) {
              deferred.reject('AUTH_REQUIRED');
            } else

            if (!Meteor.user().role.trainer) {
              deferred.reject('TRAINER_PERMISSION_REQUIRED');
            }

            if (!Meteor.user().profile.fname) {
              deferred.reject('USER_PROFILE_IS_EMPTY');
            }

            else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        },
        controller: function () {
          Meteor.subscribe('groups');
        }
      });
  });

})();
