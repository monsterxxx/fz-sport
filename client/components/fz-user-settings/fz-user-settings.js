(function() {
// 'use strict';

angular
  .module('fz.user-settings', [
    'fz.window',
    'fz.field',
    'fz.input-submit'
  ])
  .directive('fzUserSettings', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-user-settings/fz-user-settings.html',
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm',
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ user: () => Meteor.user() });
  vm.show = false;
  vm.updateUserProfile = updateUserProfile;
  vm.getAvailableModules = getAvailableModules;
  vm.getModuleName = getModuleName;

  function updateUserProfile() {
    Meteor.call('updateUserProfile', Meteor.userId(), vm.user.profile);
  }

  function getAvailableModules() {
    var availableModules = [];
    if (vm.user) {
      _.each(vm.user.role, function (appointed, role) {
        if (appointed) { availableModules.push(role); }
      });
    }
    return availableModules;
  }

  function getModuleName(module) {
    switch(module) {
      case 'client':
        return 'Клиент';
      case 'trainer':
        return 'Тренер';
      case 'admin':
        return 'Администратор';
    }
  }
}

})();
