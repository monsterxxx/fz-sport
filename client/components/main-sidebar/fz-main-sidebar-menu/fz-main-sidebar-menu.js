(function() {
// 'use strict';

angular
  .module('fz.main-sidebar-menu', [
  ])
  .directive('fzMainSidebarMenu', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/main-sidebar/fz-main-sidebar-menu/fz-main-sidebar-menu.html',
    // replace: true,
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  var vm = this;
  $reactive(vm).attach($scope);
  vm.roles = Roles.getRolesForUser(Meteor.userId(), $stateParams.companyId);
  for (let role of ['owner', 'admin', 'trainer']) {
    if (vm.roles.indexOf(role) !== -1) {
      vm.role = role;
    }
  }
}

})();
