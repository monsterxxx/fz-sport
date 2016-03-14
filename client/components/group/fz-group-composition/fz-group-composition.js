(function() {
// 'use strict';

angular
  .module('fz.group-composition', [
  ])
  .directive('fzGroupComposition', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/group/fz-group-composition/fz-group-composition.html',
    scope: {},
    bindToController: {
      groupId: '@',
    },
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  var vm = this;
  $reactive(vm).attach($scope);
  let companyId = $stateParams.companyId;
  vm.helpers({
    group: () => Groups.findOne(vm.groupId, {fields: {name: 1, trainer: 1, clients: 1}}),
    userIsOwner: () => Roles.userIsInRole(Meteor.userId(), 'owner', companyId)
  });
  vm.add = true;
  vm.delete = true;
  vm.deleteGroup = deleteGroup;
  vm.addMemberToGroup = addMemberToGroup;
  vm.removeMemberFromGroup = removeMemberFromGroup;

  function deleteGroup() {
    Meteor.call('deleteGroup', vm.groupId);
  }

  function addMemberToGroup(memberId, surrogate) {
    let args = [vm.groupId, memberId];
    if (surrogate) {
      args.push(surrogate);
    }
    Meteor.apply('addMemberToGroup', args, (err) => {
      if (err) console.log(err);
    });
    vm.foundMembers = [];
  }

  function removeMemberFromGroup(memberId) {
    Meteor.call('removeMemberFromGroup', vm.groupId, memberId);
  }

}

})();
