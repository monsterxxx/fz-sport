(function() {
'use strict';

angular
  .module('fz.clients-table', [])
  .directive('fzClientsTable', fzUserSettings);

function fzUserSettings() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-clients-table/fz-clients-table.html',
    scope: {},
    bindToController: {},
    controller: Ctrl,
    controllerAs: 'vm',
  };

  return directive;
}

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {

  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ clients: () => Clients.find({}, { sort: { name: 1 } }) });
  vm.newClient = {};
  vm.addClient = addClient;
  vm.updClient = updClient;
  vm.delClient = delClient;

  function updClient(id) {
    var client = _.detect(vm.clients, function (client) { return client._id === id; });
    Clients.update( { _id: id }, { $set: { 'came': client.came }} );
  }

  function addClient() {
    vm.newClient.createdAt = new Date();
    console.log('newClient insert: '+ JSON.stringify(vm.newClient , null, 2));
    Clients.insert(vm.newClient);
    vm.newClient = {};
  }

  function delClient(client) {
    Clients.remove({_id: client._id});
  }

}

})();
