(function() {
'use strict';

angular
  .module('fz.form-client-add', [
    'fz.buttons-submit'
  ])
  .directive('fzFormClientAdd', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-form-client-add/fz-form-client-add.html',
    scope: {},
    bindToController: {
      groupId: '@',
      show: '='
    },
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  var vm = this;
  $reactive(vm).attach($scope);

  var oriModel = angular.copy(vm.client);
  vm.isFormChanged = isFormChanged;
  vm.resetForm = resetForm;
  vm.addClient = addClient;

  function isFormChanged() {
    return !angular.equals(vm.client, oriModel);
  }

  function resetForm() {
    vm.client = angular.copy(oriModel);
    vm.form.$setPristine();
  }

  function addClient(client) {
    Meteor.call('addClient', client, vm.groupId);
    vm.resetForm();
    vm.show = false;
  }

  // vm.search = '';
  // vm.searchResult = [];
  vm.subscribe('searchClients', () => {
    return [ vm.getReactively('client.name') ];
  });
  vm.helpers({ foundClients: () => Clients.find( {}, { sort: [['score', 'desc']] } ) });
}

})();
