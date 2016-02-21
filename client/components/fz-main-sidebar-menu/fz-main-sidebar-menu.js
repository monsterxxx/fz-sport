(function() {
// 'use strict';

angular
  .module('fz.main-sidebar-menu', [
  ])
  .directive('fzMainSidebarMenu', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-main-sidebar-menu/fz-main-sidebar-menu.html',
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
  vm.role = (vm.roles.indexOf('owner') !== -1) ? 'owner'
    : (vm.roles.indexOf('admin') !== -1) ? 'admin'
      : (vm.roles.indexOf('trainer') !== -1) ? 'trainer'
        : 'client';
}

})();
