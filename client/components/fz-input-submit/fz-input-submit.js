(function() {
// 'use strict';

angular
  .module('fz.input-submit', [])
  .directive('fzInputSubmit', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-input-submit/fz-input-submit.html',
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
