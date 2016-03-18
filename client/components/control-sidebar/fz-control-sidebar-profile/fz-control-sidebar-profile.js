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
  let oriProfile;
  vm.helpers({ user: () => {
    const user = Meteor.user();
    if (user) oriProfile = angular.copy(user.profile);
    vm.profileChanged = false;
    return user;
  } });
  $scope.$watch(() => vm.user, (user) => {
    if (user) vm.profileChanged = !angular.equals(user.profile, oriProfile);
  }, true);
  vm.updateUserProfile = updateUserProfile;

  function updateUserProfile() {
    Meteor.call('updateUserProfile', Meteor.userId(), vm.user.profile);
  }
}

})();
