(function() {
'use strict';

angular
  .module('fz.field', [])
  .directive('fzField', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-field/fz-field.html',
    transclude: true,
    scope: {},
    bindToController: {
      name: '@fieldName'
    },
    controller: function () {},
    controllerAs: 'field'
  };

  return directive;
}

})();
