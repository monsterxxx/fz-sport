(function() {
// 'use strict';

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
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({
    company: () => {
      let company = Companies.findOne($stateParams.companyId, {fields: {owners: 1, admins: 1, trainers: 1, clients: 1}});
      if (company) {
        vm.people = company[vm.peopleRole + 's'];
      }
      return company;
    },
  });

  vm.addUserToCompany = addUserToCompany;
  vm.removeUserFromCompany = removeUserFromCompany;

  function addUserToCompany(userId) {
    Meteor.call('addUserToCompany', vm.company._id, userId, vm.peopleRole);
  }

  function removeUserFromCompany(userId) {
    Meteor.call('removeUserFromCompany', vm.company._id, userId, vm.peopleRole);
  }

}

})();
