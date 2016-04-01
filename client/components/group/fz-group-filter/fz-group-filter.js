(function() {
'use strict';

angular
  .module('fz.group-filter', [])
  .component('fzGroupFilter',
    {
      templateUrl: `client/components/group/fz-group-filter/fz-group-filter.html`,
      bindings: {
        trainer: '=',
        change: '&?'
      },
      controller: Ctrl,
      controllerAs: 'vm'
    }
  );

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  // console.log('fz-group-filter Ctrl');
  const vm = this,
        companyId = $stateParams.companyId;
  vm.showPicker = false;
  $reactive(vm).attach($scope);
  vm.helpers({ trainers: () => {
                 let company = Companies.findOne(companyId, {fields: {trainers: 1}});
                 if (company) return company.trainers;
               }
             });
  console.log($('#month-picker'));
  $('#month-picker').MonthPicker({ StartYear: 2020, ShowIcon: true });
  // $('#month-picker').MonthPicker({ StartYear: 2020, ShowIcon: false });
  // $('#month-picker').MonthPicker({'Position': {my: 'left top', at: 'left bottom', of: '#month-picker-toggle'}});
}

})();
