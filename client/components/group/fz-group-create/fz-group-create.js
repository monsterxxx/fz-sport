(function() {
// 'use strict';

angular
  .module('fz.group-create', [
  ])
  .directive('fzGroupCreate', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/group/fz-group-create/fz-group-create.html',
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive', '$stateParams'];

function Ctrl($scope, $reactive, $stateParams) {
  let vm = this;
  $reactive(vm).attach($scope);
  const companyId = $stateParams.companyId;
  vm.createGroup = createGroup;

  acquireTrainers();

  function acquireTrainers() {
    if (Roles.userIsInRole(Meteor.userId(), ['owner', 'admin'], companyId)) {
      vm.helpers({company: () => {
        const company = Companies.findOne({}, {fields: {trainers: 1}});
        if (company) {vm.trainers = company.trainers;}
        return company;
      }});
    } else if (Roles.userIsInRole(Meteor.userId(), 'trainer', companyId)) {
      vm.trainers = [{_id: Meteor.userId(), name: Meteor.user().profile.fname}];
    }
  }

  function createGroup(trainerId, trainerName) {
    let group = {
      company: {
        _id: companyId
      },
      trainer: {
        _id: trainerId,
        name: trainerName
      },
      name: vm.group.name
    };

    Meteor.call('createGroup', group, function (err, done) {
      if (done) { $scope.$apply( function() { vm.showBox = false; } ); }
    });
  }
}

})();
