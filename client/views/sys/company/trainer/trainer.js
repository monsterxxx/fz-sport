(function() {
'use strict';

angular
  .module('fz.company.trainer', [])
  .config(function ($stateProvider) {
    $stateProvider
      .state('sys.company.trainer', {
        url: '/trainer',
        templateUrl: 'client/views/sys/company/trainer/trainer.html',
        resolve: {
          auth: ($q, $stateParams) => {
            var deferred = $q.defer();

            //only trainers allowed
            if (! Roles.userIsInRole(Meteor.userId(), 'trainer', $stateParams.companyId)) {
              deferred.reject({name: 'redirect'});
            } else {
              deferred.resolve();
            }

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
