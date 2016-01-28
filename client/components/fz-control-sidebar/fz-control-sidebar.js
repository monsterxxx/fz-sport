(function() {
// 'use strict';

angular
  .module('fz.control-sidebar', [
  ])
  .directive('fzControlSidebar', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'client/components/fz-control-sidebar/fz-control-sidebar.html',
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm',
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  var vm = this;
  vm.selectedTab = 1;


}

})();
