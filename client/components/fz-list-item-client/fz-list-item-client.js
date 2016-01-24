(function() {
'use strict';

angular
  .module('fz.list-item-client', [
    'fz.list'
  ])
  .directive('fzListItemClient', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-list-item-client/fz-list-item-client.html',
    scope: {},
    bindToController: {
      client: '=',
      showAttendance: '='
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
