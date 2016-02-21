(function() {
'use strict';

angular
  .module('fz.groups', [

    //ROUTES
    'fz.groups.composition',
    // 'fz.groups.admin',

  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.groups', {
        url: '/groups',
        resolve: {
          auth: ($q, $stateParams) => {
            console.log('auth company');
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
          }
        },
        template: '<div ui-view></div>',
        controller: Ctrl
      });
  });

Ctrl.$inject = ['$stateParams'];

function Ctrl($stateParams) {
  // console.log('groups ctrl');
  Meteor.subscribe('groups', $stateParams.companyId);
}

})();
