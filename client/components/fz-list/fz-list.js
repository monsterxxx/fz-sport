(function() {
'use strict';

angular
  .module('fz.list', [])
  .directive('fzList', fzUserSettings);

function fzUserSettings() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-list/fz-list.html',
    transclude: {
      'new': 'fzListNew',
      'list': 'fzListList'
    },
    scope: {},
    bindToController: {
      listTitle: '@',
      showNew: '=',
      showAttendance: '=',
      showCheck: '=',
      checkModel: '='
    },
    controller: Ctrl,
    controllerAs: 'vm',
    link: function(scope, element, attrs){
      // Some fancy logic.
    }
  };

  return directive;

}

Ctrl.$inject = ['$timeout'];

function Ctrl($timeout) {
  var vm = this;
  vm.add = add; //could not call it new, as it's reserved js word
  vm.attendance = attendance;
  vm.check = check;

  function add(event) {
    event.stopPropagation();
    vm.showNew = true;
  }

  function attendance(event) {
    event.stopPropagation();
    vm.showAttendance = !vm.showAttendance;
  }

  function check(event) {
    event.stopPropagation();
  }
}

})();
