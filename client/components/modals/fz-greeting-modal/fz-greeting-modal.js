(function() {
'use strict';

angular
  .module('fz.greeting-modal', [])
  .component('fzGreetingModal',
    {
      templateUrl: `client/components/modals/fz-greeting-modal/fz-greeting-modal.html`,
      bindings: {},
      controller: Ctrl,
      controllerAs: 'vm'
    }
  );

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  var vm = this;
  $reactive(vm).attach($scope);
  let oriProfile;
  vm.helpers({ user: () => {
    const user = Meteor.user();
    if (user) oriProfile = angular.copy(user.profile);
    return user;
  } });
  vm.updateUserProfile = updateUserProfile;

  //initialize modal
  $('#fzGreetingModal').modal({
    backdrop: false,
    keyboard: false
  });

  function updateUserProfile() {
    Meteor.call('updateUserProfile', Meteor.userId(), vm.user.profile, (err) => {
      if (!err) {
        $('#fzGreetingModal').modal('hide');
      }
    });
  }

  $scope.$watch(() => vm.user, function (user) {
    if (user) {
      vm.profileChanged = !angular.equals(user.profile, oriProfile);
    }
  }, true);
}

})();
