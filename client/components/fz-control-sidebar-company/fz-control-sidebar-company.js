(function() {
// 'use strict';

angular
  .module('fz.control-sidebar-company', [
  ])
  .directive('fzControlSidebarCompany', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-control-sidebar-company/fz-control-sidebar-company.html',
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive', '$stateParams', '$state'];

function Ctrl($scope, $reactive, $stateParams, $state) {
  var vm = this;
  $reactive(vm).attach($scope);
  vm.showDelete = false;
  vm.helpers({ company: () => {
    let company = Companies.findOne($stateParams.companyId);
    if (company) {
      vm.showDelete = _.any(company.owners, (owner) => owner._id === Meteor.userId());
    }
    return company;
  } });
  vm.deleteCompany = deleteCompany;

  function deleteCompany() {
    Meteor.call('deleteCompany', vm.company._id, (err, res) => {
      if (! err) {
        $state.go('home');
      }
    });
  }
}

})();
