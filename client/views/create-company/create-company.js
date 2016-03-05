(function() {
'use strict';

angular
  .module('fz.create-company', [

  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('create-company', {
        url: '/create-company',
        templateUrl: 'client/views/create-company/create-company.html',
        resolve: {
          auth: ($q) => {
            var deferred = $q.defer();

            if (!Meteor.user()) {
              deferred.reject({name: 'index'});
              return deferred.promise;
            }
            //if user has already created a company, go to home page
            if (_.any(Meteor.user().companies, (company) => company.creator)) {
              deferred.reject({name: 'home'});
            }
            else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        },
        controller: Ctrl,
        controllerAs: 'vm'
      });
  });

Ctrl.$inject = ['$scope', '$rootScope', '$reactive', '$state'];

function Ctrl($scope, $rootScope, $reactive, $state) {
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ tasks: () => Meteor.user().tasks });
  vm.hasTask = hasTask;
  vm.createCompany = createCompany;
  //select "Create new company" option in fz-company-select
  $rootScope.company = {_id: 1};

  function hasTask(id) {
    return _.any(vm.tasks, (task) => task.id === 1);
  }

  function createCompany() {
    Meteor.call('createCompany', vm.company, (err, res) => {
      if (err) {
        if (err.error === 'company-name-busy') {
          vm.showError = true;
        }
      } else {
        vm.showError = false;
        $state.go('company.structure', {companyId: res._id});
      }
    });
  }
}

})();
