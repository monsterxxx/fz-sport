(function() {
// 'use strict';

angular
  .module('fz.input', [])
  .directive('fzInput', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-input/fz-input.html',
    scope: {},
    bindToController: {
      model: '=',
      onOk: '&',
      placeholder: '@'
    },
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;

}

function Ctrl() {
  var vm = this;
  var originalValue = vm.model;
  vm.cancel = cancel;

  function cancel() {
    vm.model = originalValue;
  }
}

})();
