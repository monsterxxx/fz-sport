(function() {
'use strict';

angular
  .module('fz.company.journal', [
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.journal', {
        url: '/journal',
        templateUrl: 'client/views/company/journal/journal.html',
        resolve: {
          auth: ($q, $stateParams) => {
            console.log('auth journal');
            var deferred = $q.defer();

            //allow owners, admins and trainers
            if (! Roles.userIsInRole(Meteor.userId(), ['owner', 'admin', 'trainer'], $stateParams.companyId)) {
              deferred.reject({name: 'home'});
              return deferred.promise;
            }

            deferred.resolve();

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
  $scope.$watch(() => vm.trainer, (trainer) => {
    if (trainer) {
      getAndDraw(trainer._id);
    } else {
      getAndDraw();
    }
  });

  const yearDeriver = $.pivotUtilities.derivers.dateFormat('date', '%y'),
        monthDeriver = $.pivotUtilities.derivers.dateFormat('date', '%m'),
        dayDeriver = $.pivotUtilities.derivers.dateFormat('date', '%d');

  function getAndDraw(trainerId) {
    let args = [companyId];
    if (trainerId) args.push(trainerId);
    Meteor.call('journal', ...args, (err, data) => {
      if (err) console.log(err);
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
    });
  }

  function filter() {
    console.log('filtered trainer: '+JSON.stringify(vm.trainer , null, 2));
  }
}

})();
