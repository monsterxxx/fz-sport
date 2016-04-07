(function() {
'use strict';

angular
  .module('fz.company.journal', [
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('sys.company.journal', {
        url: '/journal',
        templateUrl: 'client/views/sys/company/journal/journal.html',
        resolve: {
          auth: ($q, $stateParams) => {
            var deferred = $q.defer();

            //allow owners, admins and trainers
            if (! Roles.userIsInRole(Meteor.userId(), ['owner', 'admin', 'trainer'], $stateParams.companyId)) {
              deferred.reject({name: 'redirect'});
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        },
        controller: Ctrl,
        controllerAs: 'vm'
      });
  });

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  // console.log('journal Ctrl');
  const vm = this,
        companyId = $stateParams.companyId;
  $reactive(vm).attach($scope);
  vm.helpers({role: () => Roles.getTopRole(Meteor.userId(), companyId)});
  $scope.$watch(() => vm.trainer, filterParamListner);
  vm.month = new Date();
  $scope.$watch(() => vm.month, filterParamListner);

  function filterParamListner(filterParam) {
    if (vm.trainer) {
      getAndDraw(vm.month, vm.trainer._id);
    } else {
      getAndDraw(vm.month);
    }
  }

  const yearDeriver = $.pivotUtilities.derivers.dateFormat('date', '%y'),
        monthDeriver = $.pivotUtilities.derivers.dateFormat('date', '%m'),
        dayDeriver = $.pivotUtilities.derivers.dateFormat('date', '%d');

  function getAndDraw(month, trainerId) {
    vm.gettingData = true;
    const monthISO = new Date(month - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,7);
    let args = [ companyId, monthISO ];
    if (trainerId) args.push(trainerId);
    Meteor.call('journal', ...args, (err, data) => {
      if (err) console.log(err);
      console.log(data);
      const isAdmin = _.contains(['owner', 'admin'], Roles.getTopRole(Meteor.userId(), companyId));
      let inputFunction = function(callback) {
        data.forEach((groupDay) => {
            groupDay.clients.forEach((client)=> {
              if (client.came) {
                let dataObj = {
                  date: groupDay.date,
                  Группа: groupDay.group,
                  Ученик: client.name
                };
                if (isAdmin) dataObj['Тренер'] = groupDay.trainer;
                callback(dataObj);
              }
            });
          }
        );
      };
      let rows = ['Группа', 'Ученик'];
      if (isAdmin) rows = ['Тренер'].concat(rows);
      $('#journal').pivot(inputFunction,
        {
          rows: rows,
          cols: ['год', 'месяц', 'день'],
          derivedAttributes: {
            'год': yearDeriver,
            'месяц': monthDeriver,
            'день': dayDeriver
          },
          hiddenAttributes: ['_id', 'date']
        }
      );
      $scope.$apply(() => vm.gettingData = false);
    });
  }
}

})();
