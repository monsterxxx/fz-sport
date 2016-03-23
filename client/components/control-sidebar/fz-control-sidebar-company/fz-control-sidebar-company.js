(function() {
// 'use strict';

angular
  .module('fz.control-sidebar-company', [
  ])
  .directive('fzControlSidebarCompany', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/control-sidebar/fz-control-sidebar-company/fz-control-sidebar-company.html',
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
  vm.helpers({ company: () => Companies.findOne($stateParams.companyId) });
  vm.showDelete = _.any(Meteor.user().companies, (company) => company._id === $stateParams.companyId && company.creator);
  vm.deleteCompany = deleteCompany;

  function deleteCompany() {
    Meteor.call('deleteCompany', vm.company._id, (err, res) => {
      if (! err) {
        $state.go('redirect');
      } else {
        console.log(err);
      }
    });
  }
}

})();
