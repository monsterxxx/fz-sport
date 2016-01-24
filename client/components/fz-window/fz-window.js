(function() {
'use strict';

angular
  .module('fz.window', [])
  .directive('fzWindow', Dir);

function Dir() {
  var directive = {
    restrict: 'E',
    templateUrl: 'client/components/fz-window/fz-window.html',
    transclude: true,
    scope: {},
    bindToController: {
      show: '=',
      title: '@windowTitle',
      close: '&'
    },
    controller: Ctrl,
    controllerAs: 'vm',
    link: Link
  };

  return directive;
}



Ctrl.$inject = ['$timeout'];

function Ctrl($timeout) {
  var vm = this;
}

function Link(scope, element, attrs) {
  // scope.heigth = element[0].firstChild.offsetHeight;
  // scope.$watch('height', function (newValue, oldValue) {
  //   console.log(newValue, oldValue);
  //   // scope.style = {
  //   //   height: element[0].firstChild.offsetHeight+'px'
  //   // };
  // });
}

})();
