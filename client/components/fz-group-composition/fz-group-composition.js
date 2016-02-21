(function() {
// 'use strict';

angular
  .module('fz.group-composition', [
  ])
  .directive('fzGroupComposition', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-group-composition/fz-group-composition.html',
    scope: {},
    bindToController: {
      groupInCompany: '=group',
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
  vm.helpers({ group: () => Groups.findOne(vm.groupInCompany._id) });

  vm.add = (typeof vm.add === 'undefined') ? true : vm.add;
  vm.delete = (typeof vm.delete === 'undefined') ? true : vm.delete;
  vm.addAs = (!vm.nonUsers) ? 'user' : 'common';

  vm.addUserToCompany = addUserToCompany;
  vm.removeUserFromCompany = removeUserFromCompany;

  function addUserToCompany() {
    Meteor.call('addUserToCompany', vm.foundUsers[0]._id, vm.company._id, vm.peopleRole);
  }

  function removeUserFromCompany(_id) {
    Meteor.call('removeUserFromCompany', _id, vm.company._id, vm.peopleRole);
  }

}

})();
