(function() {
// 'use strict';

angular
  .module('fz.people-list', [
  ])
  .directive('fzPeopleList', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-people-list/fz-people-list.html',
    scope: {},
    bindToController: {
      peopleRole: '@',
      listTitle: '@',
      listStyle: '@',
      nonUsers: '=',
      add: '=',
      delete: '='
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
      let company = Companies.findOne($stateParams.companyId);
      if (company) {
        vm.people = company[vm.peopleRole + 's'];
      }
      return company;
    },
  });
  vm.add = (typeof vm.add === 'undefined') ? true : vm.add;
  vm.delete = (typeof vm.delete === 'undefined') ? true : vm.delete;

  vm.addUserToCompany = addUserToCompany;
  vm.removeUserFromCompany = removeUserFromCompany;

  function addUserToCompany(userId) {
    Meteor.call('addUserToCompany', userId, vm.company._id, vm.peopleRole);
  }

  function removeUserFromCompany(userId) {
    Meteor.call('removeUserFromCompany', userId, vm.company._id, vm.peopleRole);
  }

}

})();
