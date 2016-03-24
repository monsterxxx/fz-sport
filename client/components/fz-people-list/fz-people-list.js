(function() {
'use strict';

angular
  .module('fz.people-list', [
    'fz.user-add',
  ])
  .directive('fzPeopleList', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: elem => `client/components/${elem.prop('tagName').toLowerCase()}/${elem.prop('tagName').toLowerCase()}.html`,
    scope: {},
    bindToController: {
      peopleRole: '@',
      listTitle: '@',
      listStyle: '@',
      add: '<?',
      delete: '<?'
    },
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  const vm = this,
        role = vm.peopleRole,
        companyId = $stateParams.companyId;
  $reactive(vm).attach($scope);
  vm.helpers({ company: companyHelper });
  vm.addMemberToCompany = (member) => Meteor.call('addMemberToCompany', companyId, member, role);
  vm.removeUserFromCompany = (userId) => Meteor.call('removeUserFromCompany', companyId, userId, role);

  function companyHelper() {
    let company = Companies.findOne(companyId, {fields: {owners: 1, admins: 1, trainers: 1, clients: 1}});
    if (company) vm.people = company[role + 's'];
    return company;
  }
}

})();
