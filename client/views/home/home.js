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
          auth: ($q, $state) => {
            console.log('auth home');
            var deferred = $q.defer();

            if (! Meteor.user()) {
              deferred.reject({name: 'index'});
              return deferred.promise;
            }

            let singleCompanyState = getSingleCompanyState();

            if (singleCompanyState) {
              deferred.reject(singleCompanyState);
            }
            else {
              deferred.resolve();
            }

            return deferred.promise;

            function getSingleCompanyState() {
              let companies = Roles.getGroupsForUser(Meteor.userId());
              //if user is a member of only one company, compose appropriate state object for redirect
              if (companies.length === 1) {
                let roles = Roles.getRolesForUser(Meteor.userId(), companies[0]);
                let state = {
                  params: {companyId: companies[0]}
                };
                //find and return state name for the highest available role
                for (let role of ['owner', 'admin', 'trainer']) {
                  if (roles.indexOf(role) !== -1) {
                    state.name = 'company.' + role;
                    return state;
                  }
                }
              }
            }
          }
        },
        controller: Ctrl,
        controllerAs: 'vm'
      });
  });

function Ctrl() {
  let vm = this;
  vm.companies = Meteor.user().companies;
  vm.blinkCompanySelect = blinkCompanySelect;

  function blinkCompanySelect(e) {
    e.preventDefault();
    e.stopPropagation();

    let screenSizes = { sm: 768 };
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
