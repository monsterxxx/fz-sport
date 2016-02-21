(function() {
// 'use strict';

angular
  .module('fz.select-from-list', [

  ])
  .directive('fzSelectFromList', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-select-from-list/fz-select-from-list.html',
    scope: {},
    bindToController: {
      list: '=',
      onSelect: '&'
    },
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  var vm = this;
  $reactive(vm).attach($scope);
}

})();
