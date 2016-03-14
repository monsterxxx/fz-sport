(function() {
'use strict';

angular
  .module('fz.att-widget', [])
  .component('fzAttWidget',
    {
      templateUrl: `client/components/widgets/fz-att-widget/fz-att-widget.html`,
      bindings: {
        role: '@'
      },
      controller: Ctrl,
      controllerAs: 'vm'
    }
  );

  Ctrl.$inject = ['$scope', '$reactive','$stateParams'];

  function Ctrl($scope, $reactive, $stateParams) {
    const vm = this,
          companyId = $stateParams.companyId;
    $reactive(vm).attach($scope);
    vm.period = 'last31days';

    vm.subscribe('att-widget', () => [ companyId, vm.role, vm.period ], {
      onReady: function () {
        let days = [];
        if (vm.role === 'owner') { days = CompanyDays.find({}).fetch(); }
        if (vm.role === 'trainer') { days = TrainerDays.find({}).fetch(); }
        console.log(days);
        generateChart(days);
      }
    });

    function generateChart(days) {
      const tz = fzDate.getTz(companyId),
            today = fzDate.todayStart(tz);
      let labels = [],
          data = [];
      for (let i = 0; i < 31; i++) {
        let day = fzDate.addDays(today, -i),
            foundDay = _.detect(days, (d) => !(d.date - day));
        data[30 - i ] = (foundDay) ? foundDay.att : 0;
        labels[30 - i] = (i % 2) ? '' : pad(day.getDate()) +'.'+ pad(day.getMonth() + 1);
      }
      let chartData = {
        labels: labels,
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: data
            }
        ]
      };
      Chart.defaults.global.responsive = true;
      Chart.defaults.global.maintainAspectRatio = false;
      let ctx = $("#attChart").get(0).getContext("2d");
      let myNewChart = new Chart(ctx).Bar(chartData, {barValueSpacing : 1});
    }

    function pad(num) { return (num < 10) ? '0' + num : num }
  }

})();
