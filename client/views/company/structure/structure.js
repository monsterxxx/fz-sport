(function() {
'use strict';

angular
  .module('fz.company.structure', [])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.structure', {
        url: '/structure',
        templateUrl: 'client/views/company/structure/structure.html',
        resolve: {
          auth: ($q, $stateParams) => {
            console.log('auth structure');
            var deferred = $q.defer();

            if (!Meteor.user()) {
              deferred.reject({name: 'index'});
            }

            else if (Roles.userIsInRole(Meteor.userId(), ['owner', 'admin'], $stateParams.companyId)) {
              deferred.resolve();
            } else {
              deferred.reject({name: 'home'});
            }

            return deferred.promise;
          }
        },
        controller: Ctrl
      });
  });

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
  console.log('structure Ctrl');
  var vm = this;
  $reactive(vm).attach($scope);
  vm.helpers({ user: () => Meteor.user() });
  vm.showCompanySelect = showCompanySelect;

  let screenSizes = { sm: 768 };

  function showCompanySelect(e) {
    e.preventDefault();
    e.stopPropagation();

    let $select = $('#company-select');

    //show main menu if it's hidden
    if ($(window).width() > (screenSizes.sm - 1)) {
      if ($('body').hasClass('sidebar-collapse')) {
        $('body').removeClass('sidebar-collapse').trigger('expanded.pushMenu');
      }
    }
    else {
      if (!$('body').hasClass('sidebar-open')) {
        console.log('should work');
        $('body').addClass('sidebar-open').trigger('expanded.pushMenu');
      }
    }

    //highlight select input for 3 seconds
    if (!$select.hasClass('highlight-borders')) {
      $select.addClass('highlight-borders');
      setTimeout(function () {
        $select.removeClass('highlight-borders');
      }, 3000);
    }
  }


}

})();
