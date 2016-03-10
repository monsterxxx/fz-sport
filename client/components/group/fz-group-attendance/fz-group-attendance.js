(function() {
// 'use strict';

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
    let vm = this,
          companyId = $stateParams.companyId,
          date = $stateParams.attDate;
    $reactive(vm).attach($scope);
    // vm.helpers({ groups: groupsHelper});
    vm.helpers({ groups: () => {
      const dayGroup = GroupDays.findOne({'group._id': vm.groupId}, {fields: {_id:1}});
      if (dayGroup) {
        return GroupDays.find({'group._id': vm.groupId});
      } else {
        return Groups.find({_id: vm.groupId}, {fields: {name: 1, company: 1, trainer: 1, clients: 1}});
      }
    }});
    vm.submitAttendance = submitAttendance;

    function groupsHelper() {
      return GroupDays.find({'group._id': vm.groupId})
             || Groups.find({_id: vm.groupId});
    }

    function submitAttendance() {
      console.log(JSON.stringify(vm.groups[0] , null, 2));
      Meteor.call('submitAttendance', vm.groups[0], date);
    }
  }

})();
