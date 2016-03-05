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
      groupInCompany: '=group',
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
  let groupId = vm.groupInCompany._id;
  let companyId = $stateParams.companyId;
  vm.helpers({ group: () => Groups.findOne(groupId) });
  vm.userIsOwner = Roles.userIsInRole(Meteor.userId(), 'owner', companyId);
  vm.deleteGroup = deleteGroup;

  function deleteGroup() {
    Meteor.call('deleteGroup', groupId);
  }

  vm.add = (typeof vm.add === 'undefined') ? true : vm.add;
  vm.delete = (typeof vm.delete === 'undefined') ? true : vm.delete;

  vm.addMemberToGroup = addMemberToGroup;
  vm.removeMemberFromGroup = removeMemberFromGroup;

  function addMemberToGroup(memberId, surrogate) {
    let args = [groupId, memberId];
    if (surrogate) {
      args.push(surrogate);
    }
    Meteor.apply('addMemberToGroup', args);
    vm.foundMembers = [];
  }

  function removeMemberFromGroup(memberId) {
    Meteor.call('removeMemberFromGroup', groupId, memberId);
  }

}

})();
