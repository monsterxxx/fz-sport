(function() {
'use strict';

angular
  .module('fz.buttons-submit', [])
  .directive('fzButtonsSubmit', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-buttons-submit/fz-buttons-submit.html',
    transclude: true,
    scope: {},
    bindToController: {
      cancel: '&',
      okText: '=',
      cancelText: '@',
      okDisabled: '=',
      cancelDisabled: '='
    },
    controller: function () {},
    controllerAs: 'vm'
  };

  return directive;
}

})();
