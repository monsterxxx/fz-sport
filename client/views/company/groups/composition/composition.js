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

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  // console.log('composition Ctrl');
  const vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ groups: () => Groups.find({}, {sort: {name: 1}, fields: {_id: 1}}) });
}

})();
