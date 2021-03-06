(function() {
'use strict';

angular
  .module('fz.company', [
    'fz.control-sidebar-company',
    'fz.main-sidebar-menu',
    //ROUTES
    'fz.company.owner',
    'fz.company.admin',
    'fz.company.trainer',
    'fz.company.journal',
    'fz.company.structure',
    'fz.groups'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('sys.company', {
        url: '/company/:companyId',
        abstract: true,
        resolve: {
          auth: ($q, $stateParams) => {
            console.log('auth company');
            const deferred = $q.defer(),
                  roles = Roles.getRolesForUser(Meteor.userId(), $stateParams.companyId);

            //allow anyone who has a role in the company
            if (! roles.length) {
              deferred.reject({name: 'redirect'});
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

Ctrl.$inject = ['$scope', '$reactive', '$stateParams', '$rootScope'];

function Ctrl($scope, $reactive, $stateParams, $rootScope) {
  // console.log('company ctrl');
  $reactive(this).attach($scope);
  let companyId = $stateParams.companyId;
  this.subscribe('company', () => [companyId]);

  //select company for company-select on the main-sidebar
  $rootScope.company = {_id: companyId};
}

})();
