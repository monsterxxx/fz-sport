(function() {
'use strict';

angular
  .module('fz.groups.attendance', [
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.groups.attendance', {
        url: '/attendance',
        templateUrl: 'client/views/company/groups/attendance/attendance.html',
        resolve: {
          auth: ($q, $stateParams) => {
            // console.log('auth attendance');
            // var deferred = $q.defer();
            // deferred.resolve();
            // return deferred.promise;
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
  vm.helpers({company: () => Companies.findOne($stateParams.companyId)});
  vm.roles = Roles.getRolesForUser(Meteor.userId(), $stateParams.companyId);

}

})();
