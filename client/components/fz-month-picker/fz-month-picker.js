(function() {
'use strict';

angular
  .module('fz.month-picker', [])
  .component('fzMonthPicker',
    {
      templateUrl: `client/components/fz-month-picker/fz-month-picker.html`,
      bindings: {
        month: '='
      },
      controller: Ctrl,
      controllerAs: 'vm'
    }
  );

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  // console.log('fz-month-picker Ctrl');
  const vm = this;
  $reactive(vm).attach($scope);
  initMonthPicker();
  $scope.$on('$destroy', onDestroy);

  function initMonthPicker() {
    $('#month-picker').MonthPicker({
      ShowIcon: false,
      i18n: {
        year: 'год',
        buttonText: 'выбрать месяц',
        prevYear: 'пред. год',
        nextYear: 'след. год',
        next12Years: 'след. 12 лет',
        prev12Years: 'пред. 12 лет',
        nextLabel: 'пред.',
        prevLabel: 'след.',
        jumpYears: 'к годам',
        backTo: 'обратно к',
        months: ['янв', 'фев','мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      },
      SelectedMonth: vm.month,
      MinMonth: new Date(2016,0,1),
      OnAfterChooseMonth: function(selectedDate) {
        $scope.$apply(() => vm.month = selectedDate);
        $('.fz-group-filter__btn').dropdown('toggle');
      }
    });
  }

  function onDestroy() {
    if (vm.month) $('#month-picker').MonthPicker('destroy');
  }
}

})();
