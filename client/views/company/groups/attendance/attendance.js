(function() {
'use strict';

angular
  .module('fz.groups.attendance', [
    'fz.group-attendance'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.groups.attendance', {
        url: '/attendance/:attDate',
        templateUrl: 'client/views/company/groups/attendance/attendance.html',
        resolve: {
          auth: ($q, $stateParams) => {
            // console.log('auth attendance');
            // var deferred = $q.defer();
            // deferred.resolve();
            // return deferred.promise;
          },
          validateAttDate: ($q, $stateParams) => {
            const deferred = $q.defer(),

                  attDate = $stateParams.attDate,
                  companyId = $stateParams.companyId,
                  //today in YYYY-MM-DD format (local). Here client's timesone is used although it might be needed in the future to tz from Companies,
                  //which would require resolve "company" state on "companies" subscribtion ready to use  Companies.findOne() here
                  today = new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0, 10);

            if (!isNaN(Date.parse(attDate))
                && (Roles.userIsInRole(Meteor.userId(), ['owner', 'admin'], companyId) && '2016-01-01' <= attDate && attDate <= today
                || Roles.userIsInRole(Meteor.userId(), 'trainer', companyId) && attDate === today)) {
              deferred.resolve();
            } else {
              deferred.reject({name: 'home'});
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
  // console.log('attendance Ctrl');
  const vm = this;
  $reactive(vm).attach($scope);
  vm.subscribe('attendance', () => [$stateParams.companyId, $stateParams.attDate]);
  vm.helpers({ groups: () => Groups.find( {}, {fields: {_id: 1}} ) });
}

})();
