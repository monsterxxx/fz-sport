(function() {
'use strict';

angular
  .module('fz.list-groups', [
    'fz.list',
    'fz.form-group-new',
    'fz.list-item-group'
  ])
  .directive('fzListGroups', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-list-groups/fz-list-groups.html',
    scope: {},
    bindToController: {
      trainerName: '@',
      trainerId: '@',
      firstLevel: '='
    },
    controller: Ctrl,
    controllerAs: 'vm',
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  let vm = this;
  $reactive(vm).attach($scope);

  // vm.subscribe('groups');
  let query = (vm.trainerId) ? {'trainer._id': vm.trainerId} : {};
  vm.helpers({ groups: () => Groups.find(query, { sort: { name: 1 } }) });
  vm.newGroup = {};
  vm.showNew = false;

}

})();
