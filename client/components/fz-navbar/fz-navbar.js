(function() {
'use strict';

angular
  .module('fz.navbar', [
    'accounts.ui',
    'fz.user-settings'
  ])
  .directive('fzNavbar', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-navbar/fz-navbar.html',
    transclude: true,
    scope: {},
    bindToController: {},
    controller: function () {},
    controllerAs: 'vm'
  };

  return directive;
}

})();
