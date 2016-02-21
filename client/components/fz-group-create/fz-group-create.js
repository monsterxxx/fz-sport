(function() {
// 'use strict';

angular
  .module('fz.group-create', [
  ])
  .directive('fzGroupCreate', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-group-create/fz-group-create.html',
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({company: () => Companies.findOne($stateParams.companyId)});
  vm.createGroup = createGroup;

  function createGroup(trainerId) {
    let group = {
      company: {
        _id: vm.company._id
      },
      trainer: {
        _id: trainerId
      },
      name: vm.group.name
    };

    Meteor.call('createGroup', group, function (err, done) {
      if (done) { $scope.$apply( function() { vm.showBox = false; } ); }
    });
  }
}

})();
