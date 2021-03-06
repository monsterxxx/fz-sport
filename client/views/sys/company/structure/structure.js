(function() {
'use strict';

angular
  .module('fz.company.structure', [
    'fz.people-list'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('sys.company.structure', {
        url: '/structure',
        templateUrl: 'client/views/sys/company/structure/structure.html',
        resolve: {
          auth: ($q, $stateParams) => {
            console.log('auth structure');
            var deferred = $q.defer();

            //only owners and admins allowed
            if (! Roles.userIsInRole(Meteor.userId(), ['owner', 'admin'], $stateParams.companyId)) {
              deferred.reject({name: 'redirect'});
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        },
        controller: Ctrl,
        controllerAs: 'vm'
      });
  });

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  // console.log('structure Ctrl');
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ roles: () => Roles.getRolesForUser(Meteor.userId(), $stateParams.companyId) });

  vm.role = 'owner';
}

})();
