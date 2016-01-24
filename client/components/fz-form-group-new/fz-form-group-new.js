(function() {
'use strict';

angular
  .module('fz.form-group-new', [
    'fz.buttons-submit'
  ])
  .directive('fzFormGroupNew', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-form-group-new/fz-form-group-new.html',
    scope: {},
    bindToController: {
      group: '=',
      show: '='
    },
    controller: Ctrl,
    controllerAs: 'vm'
  };

  return directive;
}

function Ctrl() {

  var vm = this;
  vm.group = vm.group || {};
  var oriModel = angular.copy(vm.group);
  vm.isFormChanged = isFormChanged;
  vm.resetForm = resetForm;
  vm.insertGroup = insertGroup;

  function isFormChanged() {
    return !angular.equals(vm.group, oriModel);
  }

  function resetForm() {
    vm.group = angular.copy(oriModel);
    vm.form.$setPristine();
  }

  function insertGroup() {
    Meteor.call('insertGroup', vm.group, Meteor.userId());
    vm.resetForm();
    vm.show = false;
  }

}

})();
