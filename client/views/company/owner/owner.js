(function() {
'use strict';

angular
  .module('fz.company.owner', [
    'fz.att-widget'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.owner', {
        url: '/owner',
        templateUrl: 'client/views/company/owner/owner.html',
        resolve: {
          auth: ($q, $stateParams) => {
            console.log('auth owner');
            var deferred = $q.defer();

            if (! Roles.userIsInRole(Meteor.userId(), 'owner', $stateParams.companyId)) {
              deferred.reject({name: 'home'});
              return deferred.promise;
            }

            deferred.resolve();

            return deferred.promise;
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
