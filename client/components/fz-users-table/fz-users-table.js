(function() {
// 'use strict';

angular
  .module('fz.users-table', [])
  .directive('fzUsersTable', Dir)
  .controller('FzUsersTableRowCtrl', FzUsersTableRowCtrl);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-users-table/fz-users-table.html',
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  let vm = this;
  $reactive(vm).attach($scope);
  vm.subscribe('users_for_admin');
  vm.helpers({ users: () => Users.find({}, { sort: { 'profile.fname': 1 } })});
}

function FzUsersTableRowCtrl($scope) {
  let vm = this;
  vm.oriSettings = angular.copy($scope.user.role);
  $scope.$watch('user', userChanged, true);
  vm.updateUserSettings = updateUserSettings;

  function updateUserSettings() {
    Meteor.call('updateUserSettings', $scope.user._id, $scope.user.role);
  }

  function userChanged(user) {
    if (user.server === true) {
      vm.oriSettings = angular.copy(user.role) || {};
      user.server = false;
    }
    else {
      vm.areSettingsChanged = _.any(user.role, function (available, module) {
        return available !== !!vm.oriSettings[module];
      });
    }
  }
}

})();
