(function() {
// 'use strict';

angular
  .module('fz.navbar-notifications', [
  ])
  .directive('fzNavbarNotifications', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/navbar/fz-navbar-notifications/fz-navbar-notifications.html',
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
  vm.helpers({ notifications: () => Meteor.user().notifications });

}

})();
