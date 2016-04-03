(function() {
'use strict';

angular
  .module('fz.group-filter', [
    'fz.month-picker'
  ])
  .component('fzGroupFilter',
    {
      templateUrl: `client/components/group/fz-group-filter/fz-group-filter.html`,
      bindings: {
        trainer: '=',
        month: '=?'
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
  $reactive(vm).attach($scope);
  vm.helpers({ trainers: () => trainersHelper });
  console.log(vm.month);
  // if (vm.month) initMonthPicker();
  // $scope.$on('$destroy', onDestroy);

  function trainersHelper() {
    let company = Companies.findOne(companyId, {fields: {trainers: 1}});
    if (company) return company.trainers;
  }

  // function initMonthPicker() {
  //   $('#month-picker').MonthPicker({
  //     ShowIcon: false,
  //     i18n: {
  //       year: 'год',
  //       buttonText: 'выбрать месяц',
  //       prevYear: "пред. год",
  //       nextYear: "след. год",
  //       next12Years: 'след. 12 лет',
  //       prev12Years: 'пред. 12 лет',
  //       nextLabel: "пред.",
  //       prevLabel: "след.",
  //       jumpYears: "к годам",
  //       backTo: "обратно к",
  //       months: ['янв', 'фев','мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  //     },
  //     SelectedMonth: vm.month,
  //     OnAfterChooseMonth: function(selectedDate) {
  //       console.log(selectedDate);
  //       $('.fz-group-filter__btn').dropdown('toggle');
  //     }
  //   });
  // }
  //
  // function onDestroy() {
  //   if (vm.month) $('#month-picker').MonthPicker('destroy');
  // }
}

})();
