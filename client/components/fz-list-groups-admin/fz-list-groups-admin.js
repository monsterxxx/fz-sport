(function() {
'use strict';

angular
  .module('fz.list-groups-admin', [
    'fz.list',
    'fz.list-groups'
  ])
  .directive('fzListGroupsAdmin', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-list-groups-admin/fz-list-groups-admin.html',
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm',
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  let vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ trainers: () => Users.find({'role.trainer': true}, {sort: {'profile.fname': 1}}) });
}

})();
