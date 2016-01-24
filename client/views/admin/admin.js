(function() {
'use strict';

angular
  .module('fz.admin', [
    'fz.pivot-attendance',
    'fz.users-table',
    'fz.list-groups-admin',
    'fz.list'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'client/views/admin/admin.html',
        resolve: {
          currentUser: ($q) => {
            var deferred = $q.defer();

            // Meteor.autorun(function () {
            //   Meteor.subscribe('users_for_admin', {
            //     onReady: function () {

                  if (Meteor.user() == null) {
                    deferred.reject('AUTH_REQUIRED');
                  } else

                  if (!Meteor.user().role.admin) {
                    deferred.reject('ADMIN_PERMISSION_REQUIRED');
                  }

                  else {
                    deferred.resolve();
                  }

            //     },
            //     onStop: deferred.reject
            //   });
            // });

            return deferred.promise;
          }
        },
        controller: function () {
          Meteor.subscribe('groups');
        }
      });
  });

})();
