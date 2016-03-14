(function() {
'use strict';

angular
  .module('fz.company.trainer', [])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.trainer', {
        url: '/trainer',
        templateUrl: 'client/views/company/trainer/trainer.html',
        resolve: {
          auth: ($q, $stateParams) => {
            console.log('auth trainer');
            var deferred = $q.defer();

            if (! Roles.userIsInRole(Meteor.userId(), 'trainer', $stateParams.companyId)) {
              deferred.reject({name: 'home'});
              console.log('! trainer');
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
  var vm = this;
  $reactive(vm).attach($scope);
}

})();
