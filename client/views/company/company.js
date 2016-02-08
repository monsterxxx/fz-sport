(function() {
'use strict';

angular
  .module('fz.company', [
    'fz.control-sidebar-company',
    //ROUTES
    'fz.company.owner',
    'fz.company.structure'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company', {
        url: '/company/:companyId',
        resolve: {
          auth: ($q, $stateParams) => {
            console.log('auth company');
            var deferred = $q.defer();

            if (! Meteor.userId()) {
              deferred.reject({name: 'index'});
              return deferred.promise;
            }

            let roles = Roles.getRolesForUser(Meteor.userId(), $stateParams.companyId);

            if (! roles.length) {
              deferred.reject({name: 'home'});
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        },
        views: {
          '': {
            template: '<div></div>',
            controller: Ctrl
          },
          'control-sidebar-company': {
            template: '<fz-control-sidebar-company></fz-control-sidebar-company>'
          }
        }
      });
  });

Ctrl.$inject = ['$stateParams'];

function Ctrl($stateParams) {
  console.log('company ctrl');
  Meteor.subscribe('company', $stateParams.companyId);
}

// AuthResolve.$inject = ['$q', '$state', '$timeout', '$stateParams'];



})();
