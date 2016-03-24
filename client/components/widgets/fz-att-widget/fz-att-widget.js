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

    vm.subscribe('att-widget', () => [ companyId, vm.role, this.getReactively('period') ], {
      onReady: function () {
        let days = [];
        if (vm.role === 'owner') { days = CompanyDays.find({}).fetch(); }
        if (vm.role === 'trainer') { days = TrainerDays.find({}).fetch(); }
        generateChart(days);
      }
    });

    function generateChart(days) {
      const tz = fzDate.getTz(companyId),
            today = fzDate.todayStart(tz);
      let labels = [],
          data = [];
      if (vm.period === 'last31days') {
        for (let i = 0; i < 31; i++) {
          let day = fzDate.addDays(today, -i),
              foundDay = _.detect(days, (d) => d.date - day === 0);
          data[30 - i ] = (foundDay) ? foundDay.att : 0;
          labels[30 - i] = (i % 2) ? '' : pad(day.getDate()) +'.'+ pad(day.getMonth() + 1);
        }
      }
      if (vm.period === 'last53weeks') {
        window.alert();
        window.alert(JSON.stringify(days , null, 2));
        let week = 0,
            n = days.length - 1;
        data = Array(53).fill(0);
        window.alert(data);
        window.alert(new Date().getTimezoneOffset());
        window.alert(new Date(today.getTime() + (new Date().getTimezoneOffset() + tz*60)*60000).getDay());
        window.alert('n: '+n);
        window.alert('week: '+week);
        for (let i = 0; i < 371; i++) {
          window.alert('i: '+i);
          let day = fzDate.addDays(today, -i);
          window.alert('day: '+day);
          window.alert('days[n].date - day === 0: '+ (days[n].date - day === 0));
          if (days[n].date - day === 0) {
            window.alert('data[52 - week]: '+data[52 - week]);
            data[52 - week] += days[n].att;
            window.alert('data[52 - week]: '+data[52 - week]);
            n--;
            window.alert('n: '+n);
          }
          window.alert('monday?: '+(new Date(day.getTime() + (new Date().getTimezoneOffset() + tz*60)*60000).getDay() === 1));
          //finish data gathering from "days" on 53rd monday
          if (new Date(day.getTime() + (new Date().getTimezoneOffset() + tz*60)*60000).getDay() === 1) {
            //labels just for mondays so that they fit in mobile screens
            window.alert('labels[52 - week]: '+labels[52 - week]);
            labels[52 - week] = (week % 4) ? '' : pad(day.getDate()) +'.'+ pad(day.getMonth() + 1);
            window.alert('labels[52 - week]: '+labels[52 - week]);
            window.alert('(week === 52): '+(week === 52));
            if (week === 52) break;
            week++;
            window.alert('week: '+week);
          }
        }
        window.alert(data);
        window.alert(labels);
      }
      let chartData = {
        labels: labels,
        datasets: [
            {
                fillColor: 'rgba(151,187,205,0.5)',
                strokeColor: 'rgba(151,187,205,0.8)',
                highlightFill: 'rgba(151,187,205,0.75)',
                highlightStroke: 'rgba(151,187,205,1)',
                data: data
            }
        ]
      };
      window.alert(JSON.stringify(chartData , null, 2));
      Chart.defaults.global.responsive = true;
      Chart.defaults.global.maintainAspectRatio = false;
      $('#attChartBoxBody').html('').append('<canvas id="attChart" height="240" style="display: block;"></canvas>');
      var ctx = $('#attChart').get(0).getContext('2d');
      var myNewChart = new Chart(ctx).Bar(chartData, {barValueSpacing : 1});
      window.alert('chart should be redrawed');
    }

    function pad(num) { return (num < 10) ? '0' + num : num; }
  }

})();
