(function() {
// 'use strict';

angular
  .module('fz.user-add', [
    
  ])
  .directive('fzUserAdd', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-user-add/fz-user-add.html',
    scope: {},
    bindToController: {
      add: '&'
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
  vm.helpers({
    foundUsers: () => Users.find( {'emails.address': vm.getReactively('newPerson.email')}, { sort: [['score', 'desc']] } )
  });
  vm.emailChanged = emailChanged;

  function emailChanged() {
    Meteor.subscribe('searchUsers', vm.newPerson.email);
  }
}

})();
