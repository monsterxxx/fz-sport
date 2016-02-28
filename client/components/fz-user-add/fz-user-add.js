(function() {
// 'use strict';

angular
  .module('fz.user-add', [

  ])
  .directive('fzUserAdd', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-user-add/fz-user-add.html',
    scope: {},
    bindToController: {
      add: '&',
      member: '='
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
  let companyId = $stateParams.companyId;
  vm.newPerson = { email: ''};
  vm.helpers({
    foundUsers: () => {
      console.log('helper> foundUsers newPerson.email: '+ vm.newPerson.email);
      if (vm.newPerson.email) {
        return Users.find( {'emails.address': vm.getReactively('newPerson.email')}, { sort: [['score', 'desc']] } )
      }
    }
  });
  vm.addAs = (typeof vm.member === 'undefined') ? 'user' : 'member';
  vm.namePattern = '';
  vm.nameChanged = nameChanged;
  vm.emailChanged = emailChanged;
  vm.addWithSurrogate = addWithSurrogate;

  function nameChanged() {
    Meteor.call('searchMembers', companyId, vm.newPerson.name, function (err, results) {
      $scope.$apply(function () {
        vm.foundMembers = results;
      });
    });
  }

  function emailChanged() {
    console.log('emailChanged newPerson.email: '+vm.newPerson.email);
    Meteor.subscribe('searchUsers', vm.newPerson.email);
  }

  function addWithSurrogate() {
    if (! /^([А-Я][а-я]+ ){1,2}([А-Я][а-я]+){1}$/.test(vm.newPerson.name)) {
      vm.namePattern = /^([А-Я][а-я]+ ){1,2}([А-Я][а-я]+){1}$/;
      return;
    }
    vm.add({ memberId:'0', surrogate: {fname: vm.newPerson.name} });
    vm.form.name.value = '';
  }
}

})();
