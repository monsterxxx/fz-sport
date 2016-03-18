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
      surrogate: '='
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
  vm.search = search;
  vm.addWithSurrogate = addWithSurrogate;

  function search() {
    Meteor.call('searchMembers', companyId, vm.searchQuery, vm.surrogate || false, function (err, results) {
      $scope.$apply(function () {
        if (err) {
          if (err.error === 'user-has-no-name') {
            vm.showError = true;
          }
        } else {
          vm.foundMembers = results;
        }
      });
    });
  }

  function addWithSurrogate() {
    vm.add({ memberId:'0', surrogate: vm.surrogate });
    vm.surrogate = {};
    vm.showNew = false;
  }
}

})();
