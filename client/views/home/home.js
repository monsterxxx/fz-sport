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
            console.log('auth home');
            var deferred = $q.defer();

            if (! Meteor.user()) {
              deferred.reject({name: 'index'});
              return deferred.promise;
            }

            let singleCompanyState = getSingleCompanyState();

            if (singleCompanyState) {
              deferred.reject(singleCompanyState);
              console.log('rejected with state');
            }
            else {
              deferred.resolve();
            }

            return deferred.promise;

            function getSingleCompanyState() {
              let companies = Roles.getGroupsForUser(Meteor.userId());
              if (companies.length === 1) {
                let roles = Roles.getRolesForUser(Meteor.userId(), companies[0]);
                if (roles.indexOf('owner') !== -1) {
                  let state ={
                    name: 'company.owner',
                    params: {companyId: companies[0]}
                  };
                  return state;
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
