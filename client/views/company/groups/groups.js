(function() {
'use strict';

angular
  .module('fz.groups', [

    //ROUTES
    'fz.groups.composition',
    'fz.groups.attendance',
    // 'fz.groups.admin',

  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.groups', {
        url: '/groups',
        resolve: {
          auth: ($q, $stateParams) => {
            //TODO maybe clients should not be allowed here in the future

            // console.log('auth groups');
            // var deferred = $q.defer();
            // deferred.resolve();
            // return deferred.promise;
          }
        },
        template: '<div ui-view></div>',
        controller: Ctrl
      });
  });

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  // console.log('groups ctrl');
  $reactive(this).attach($scope);
  this.subscribe('groups', () => [$stateParams.companyId]);
}

})();
