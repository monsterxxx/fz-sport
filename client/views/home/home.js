(function() {
'use strict';

angular
  .module('fz.home', [])
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'client/views/home/home.html',
        resolve: {
          auth: ($q, $state, $timeout) => {
            var deferred = $q.defer();

            if (!Meteor.user()) {
              deferred.reject('go-index');
              return deferred.promise;
            }

            $timeout(function () {
              let onlyOneRole = getOnlyOneRole();

              if (onlyOneRole) {
                $state.go(onlyOneRole);
                deferred.reject();
              }
              else {
                deferred.resolve();
              }
            });

            return deferred.promise;

            function getOnlyOneRole() {
              if (!Meteor.user().roles) { return; }

              let role = Meteor.user().roles,
              count = 0,
              state = '';
              _.each(role, function (access, module) {
                if (access) {
                  state = module;
                  count++;
                }
              });
              if (count === 1) { return state; }
            }

          }
        },
        controller: Ctrl,
        controllerAs: 'vm'
      });
  });

function Ctrl() {
  let vm = this;
  vm.companies = (Meteor.user().companies) ? true : false;
  vm.showCompanySelect = showCompanySelect;

  let screenSizes = { sm: 768 };

  function showCompanySelect(e) {
    e.preventDefault();
    e.stopPropagation();

    let $select = $('#company-select');

    //show main menu if it's hidden
    if ($(window).width() > (screenSizes.sm - 1)) {
      if ($("body").hasClass('sidebar-collapse')) {
        $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
      }
    }
    else {
      if (!$("body").hasClass('sidebar-open')) {
        console.log('should work');
        $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
      }
    }

    //highlight select input for 3 seconds
    if (!$select.hasClass('highlight-borders')) {
      $select.addClass('highlight-borders');
      setTimeout(function () {
        $select.removeClass('highlight-borders');
      }, 3000)
    }
  }


};

})();
