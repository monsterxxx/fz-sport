(function() {
'use strict';

angular
  .module('fz.company.owner', [])
  .config(function ($stateProvider) {
    $stateProvider
      .state('company.owner', {
        url: '/owner',
        templateUrl: 'client/views/company/owner/owner.html',
        resolve: {
          auth: ($q, $state, $timeout) => {
            console.log('auth owner');
            var deferred = $q.defer();

            if (!Meteor.user()) {
              console.log('! user');
              deferred.reject({name: 'index'});
              return deferred.promise;
            }

            deferred.resolve();

            // $timeout(function () {
            //   let onlyOneRole = getOnlyOneRole();
            //
            //   if (onlyOneRole) {
            //     $state.go(onlyOneRole);
            //     deferred.reject();
            //   }
            //   else {
            //     deferred.resolve();
            //   }
            // });

            return deferred.promise;

            // function getOnlyOneRole() {
            //   if (!Meteor.user().roles) { return; }
            //
            //   let role = Meteor.user().roles,
            //   count = 0,
            //   state = '';
            //   _.each(role, function (access, module) {
            //     if (access) {
            //       state = module;
            //       count++;
            //     }
            //   });
            //   if (count === 1) { return state; }
            // }

          }
        },
        controller: Ctrl
      });
  });

Ctrl.$inject = ['$scope', '$reactive'];

function Ctrl($scope, $reactive) {
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
