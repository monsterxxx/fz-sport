(function() {
'use strict';

angular
  .module('fz.company', [
    'fz.control-sidebar-company',
    'fz.main-sidebar-menu',
    //ROUTES
    'fz.company.owner',
    'fz.company.admin',
    'fz.company.structure',
    'fz.groups'
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
            template: '<div ui-view></div>',
            controller: Ctrl
          },
          'control-sidebar-company': {
            template: '<fz-control-sidebar-company></fz-control-sidebar-company>'
          },
          'fz-main-menu': {
            template: '<fz-main-sidebar-menu></fz-main-sidebar-menu>'
          }
        }
      });
  });

Ctrl.$inject = ['$stateParams'];

function Ctrl($stateParams) {
  // console.log('company ctrl');
  Meteor.subscribe('company', $stateParams.companyId);
}

// AuthResolve.$inject = ['$q', '$state', '$timeout', '$stateParams'];



})();
