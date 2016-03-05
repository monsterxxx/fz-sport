(function() {
// 'use strict';

angular
  .module('fz.control-sidebar-profile', [
  ])
  .directive('fzControlSidebarProfile', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/control-sidebar/fz-control-sidebar-profile/fz-control-sidebar-profile.html',
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
  vm.helpers({ user: () => Meteor.user() });
  let oriProfile;
  if (vm.user) { oriProfile = angular.copy(vm.user.profile); }
  vm.updateUserProfile = updateUserProfile;

  function updateUserProfile() {
    Meteor.call('updateUserProfile', Meteor.userId(), vm.user.profile);
  }

  $scope.$watch(() => vm.user, function (user) {
    if (user) {
      if (user.server) {
        oriProfile = angular.copy(vm.user.profile);
        user.server = false;
      }
      vm.profileChanged = !angular.equals(user.profile, oriProfile);
    }
  }, true);
}

})();
