(function() {
// 'use strict';

angular
  .module('fz.navbar-tasks', [
  ])
  .directive('fzNavbarTasks', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/navbar/fz-navbar-tasks/fz-navbar-tasks.html',
    replace: true,
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ tasks: () => Meteor.user().tasks });
  vm.showFnameInput = showFnameInput;

  function showFnameInput(e) {
    e.preventDefault();
    e.stopPropagation();
    let sidebar = $('.control-sidebar');
    let $input = sidebar.find('#control-sidebar-fname');

    //If the sidebar is not open
    if (!sidebar.hasClass('control-sidebar-open')
        && !$('body').hasClass('control-sidebar-open')) {
      //Open the sidebar
      sidebar.addClass('control-sidebar-open');
    }

    //highlight fname input for 3 seconds
    if (!$input.hasClass('highlight-borders')) {
      $input.addClass('highlight-borders');
      setTimeout(function () {
        $input.focus();
      }, 200);
      setTimeout(function () {
        $input.removeClass('highlight-borders');
      }, 3000);
    }

  }
}

})();
