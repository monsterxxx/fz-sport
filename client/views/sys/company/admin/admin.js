(function() {
'use strict';

angular
  .module('fz.company.admin', [])
  .config(function ($stateProvider) {
    $stateProvider
      .state('sys.company.admin', {
        url: '/admin',
        templateUrl: 'client/views/sys/company/admin/admin.html',
        resolve: {
          auth: ($q, $stateParams) => {
            var deferred = $q.defer();

            if (! Roles.userIsInRole(Meteor.userId(), 'admin', $stateParams.companyId)) {
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
