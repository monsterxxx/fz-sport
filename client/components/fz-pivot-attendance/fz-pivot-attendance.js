(function() {
'use strict';

angular
  .module('fz.pivot-attendance', [
  ])
  .directive('fzPivotAttendance', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-pivot-attendance/fz-pivot-attendance.html',
    scope: {},
    bindToController: {
    },
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive', '$timeout'];

function Ctrl($scope, $reactive, $timeout) {
  var vm = this;
  $reactive(vm).attach($scope);

  vm.subscribe('attendance');
  vm.helpers({ attendance: () => Attendance.find({}) });

  var yearDeriver = $.pivotUtilities.derivers.dateFormat('createdAt', '%y');
  var monthDeriver = $.pivotUtilities.derivers.dateFormat('createdAt', '%m');
  var dayDeriver = $.pivotUtilities.derivers.dateFormat('createdAt', '%d');

  var timeout;
  $scope.$watch(() => vm.attendance, function () {
    $timeout.cancel(timeout);
    timeout = $timeout(function(){
      $('#output').pivotUI(vm.attendance,
        {
          rows: ['Тренер', 'Группа', 'Клиент'],
          cols: ['год', 'месяц', 'день'],
          derivedAttributes: {
            'год': yearDeriver,
            'месяц': monthDeriver,
            'день': dayDeriver,
            'Тренер': function (rec) { return rec.trainer; },
            'Группа': function (rec) { return rec.group; },
            'Клиент': function (rec) { return rec.client; }
          },
          hiddenAttributes: ['_id', 'group', 'trainer', 'client', 'createdAt']
        }
      );
    }, 500);
  }, true);
}

})();
