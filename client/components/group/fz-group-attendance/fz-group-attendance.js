(function() {
'use strict';

angular
  .module('fz.group-attendance', [])
  .component('fzGroupAttendance',
    {
      templateUrl: `client/components/group/fz-group-attendance/fz-group-attendance.html`,
      bindings: {
        groupId: '@'
      },
      controller: Ctrl,
      controllerAs: 'vm'
    }
  );

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  const vm = this,
        companyId = $stateParams.companyId,
        date = $stateParams.attDate;
  $reactive(vm).attach($scope);
  let oriAtt;
  vm.helpers({ group: groupHelper,
               role: () => Roles.getTopRole(Meteor.userId(), companyId)});
  $scope.$watch(() => vm.group, groupListener, true);
  vm.submitAttendance = submitAttendance;

  function groupHelper() {
    vm.attChanged = false;
    let dayGroup = GroupDays.findOne({'group._id': vm.groupId});
    dayGroup = dayGroup || Groups.findOne({_id: vm.groupId}, {fields: {name: 1, company: 1, trainer: 1, clients: 1}});
    oriAtt = angular.copy(dayGroup.clients);
    vm.attChanged = false;
    return dayGroup;
  }

  function groupListener(group) {
    vm.attChanged = group && _.any(group.clients, (client, i) => client.came !== oriAtt[i].came);
  }

  function submitAttendance() {
    console.log(JSON.stringify(vm.group, null, 2));
    Meteor.call('submitAttendance', vm.group, date);
  }
}

})();
