(function() {
'use strict';

angular
  .module('fz.company.owner', [
    'fz.att-widget'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('sys.company.owner', {
        url: '/owner',
        templateUrl: 'client/views/sys/company/owner/owner.html',
        resolve: {
          auth: ($q, $stateParams) => {
            var deferred = $q.defer();

            resolve();
            return deferred.promise;

            function resolve() {
              //only owners allowed
              if (! Roles.userIsInRole(Meteor.userId(), 'owner', $stateParams.companyId)) {
                deferred.reject({name: 'redirect'});
              } else {
                deferred.resolve();
              }
            }
          }
        },
        controller: Ctrl
      });
  });

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  const vm = this;
  $reactive(vm).attach($scope);
}

})();
