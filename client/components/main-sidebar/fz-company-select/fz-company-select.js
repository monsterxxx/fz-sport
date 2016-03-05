(function() {
// 'use strict';

angular
  .module('fz.company-select', [])
  .component('fzCompanySelect',
    {
      templateUrl: `client/components/main-sidebar/fz-company-select/fz-company-select-.html`,
      bindings: {},
      controller: Ctrl,
      controllerAs: 'vm'
    }
  );

Ctrl.$inject = ['$scope', '$reactive', '$rootScope', '$state'];

function Ctrl($scope, $reactive, $rootScope, $state) {
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ companies: companiesHelper });
  vm.goToSelected = goToSelected;

  function companiesHelper() {
    let companies = Meteor.user().companies || [];
    if (! _.any(companies, (company) => company.creator)) {
      companies.push({
        _id: 1,
        name: 'Открыть свою компанию'
      });
    }
    return companies;
  }

  function goToSelected() {
    if (! $rootScope.company) return;
    let companyId = $rootScope.company._id;
    if (companyId === 1) {
      $state.go('create-company');
    } else {
      //go to selected company to highest available role view
      let roles = Meteor.user().roles[companyId];
      for (let role of ['owner', 'admin', 'trainer']) {
        if (roles.indexOf(role) !== -1) {
          return $state.go('company.'+ role, {companyId: companyId});
        }
      }
    }
  }
}

})();
