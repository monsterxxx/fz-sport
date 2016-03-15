(function() {
'use strict';

angular
  .module('fz.groups.composition', [
    'fz.group-create',
    'fz.group-composition',
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.groups.composition', {
        url: '/composition',
        templateUrl: 'client/views/company/groups/composition/composition.html',
        resolve: {
          auth: ($q, $stateParams) => {
            // console.log('auth composition');
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
  // console.log('composition Ctrl');
  const vm = this,
        companyId = $stateParams.companyId;
  $reactive(vm).attach($scope);
  vm.helpers({
    groups: () => {
      const trainer = vm.getReactively('trainer');
      let query = (trainer) ? {'trainer._id': trainer._id} : {};
      return Groups.find( query, {sort: {name: 1}, fields: {_id: 1}} );
    },
    role: () => Roles.getTopRole(Meteor.userId(), companyId)
  });
}

})();
