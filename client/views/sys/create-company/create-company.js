(function() {
'use strict';

angular
  .module('fz.create-company', [

  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('sys.create-company', {
        url: '/create-company',
        templateUrl: 'client/views/sys/create-company/create-company.html',
        resolve: {
          auth: ($q) => {
            var deferred = $q.defer();

            //only allowed users who has not created their own company yet
            if (Users.findOne({_id: Meteor.userId(), 'companies.creator': true})) {
              deferred.reject({name: 'redirect'});
            }
            else {
              deferred.resolve();
            }

            return deferred.promise;
          },
          Timezones: ($http) => {
            return $http.get('/timezones.json').then((data) => data);
          }
        },
        controller: Ctrl,
        controllerAs: 'vm'
      });
  });

Ctrl.$inject = ['$scope', '$rootScope', '$reactive', '$state', 'Timezones'];

function Ctrl($scope, $rootScope, $reactive, $state, Timezones) {
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ tasks: () => Meteor.user().tasks });
  vm.hasTask = hasTask;
  //TODO add more timezones
  vm.timezones = Timezones.data;
  vm.timezone = { offset: getTzOffset() };
  vm.createCompany = createCompany;

  //select "Create new company" option in fz-company-select
  $rootScope.company = {_id: 1};

  function hasTask(id) {
    return _.any(vm.tasks, (task) => task.id === 1);
  }

  function getTzOffset() {
    let date = new Date().toString();
    let gmtPos = date.search(/GMT/);
    return date.slice(gmtPos, gmtPos + 6).concat(':00');
  }

  function createCompany() {
    let tz = vm.timezone.offset;
    Meteor.call('createCompany',
    _.extend(vm.company, {
      params: {
        tz: parseFloat(tz.slice(3, 6) + (tz.slice(7, 9)/60).toString().substr(1))
      }
    }), (err, res) => {
      if (err) {
        if (err.error === 'company-name-busy') {
          vm.showError = true;
        }
      } else {
        vm.showError = false;
        $state.go('sys.company.structure', {companyId: res._id});
      }
    });
  }
}

})();
