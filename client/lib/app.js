(function(){
'use strict';

angular.module('fz', [
  //CORE
  'angular-meteor',
  // 'angular-meteor.auth',
  'ui.router',
  //AUTHORIZATION
  'accounts.ui',
  //CONTROL SIDEBAR
  'fz.control-sidebar',
  'fz.control-sidebar-profile',
  //ROUTES
  'fz.admin',
  'fz.trainer'
])

.config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'client/views/index/index.html'
  })
  .state('home', {
    url: '/home',
    template: '<div></div>',
    resolve: {
      redirect: ($q, $state, $timeout) => {
        var deferred = $q.defer();

        $timeout(function () {

          if (Meteor.user() == null) {
            deferred.resolve();
          } else {

            let onlyOneRole = getOnlyOneRole();

            if (onlyOneRole) {
              $state.go(onlyOneRole);
              deferred.reject();
            }

            else {
              deferred.resolve();
            }

          }

        });

        return deferred.promise;

        function getOnlyOneRole() {
          let role = Meteor.user().role,
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
    }
  });

  $urlRouterProvider.otherwise('/');
})

.run(function ($state, $rootScope) {
  // console.log('RUN');

  //when user loggs in or out go to home state
  Meteor.autorun(function () {
    // if (Meteor.userId()) {}
    $rootScope.user = Meteor.user();
    console.log($rootScope.user);
    if ($rootScope.user) {
      if ($rootScope.user.profile
          && /^([А-Я][а-я]+ ){2}([А-Я][а-я]+){1}$/.test($rootScope.user.profile.fname))
      {
        var nameArr = $rootScope.user.profile.fname.split(' ');
        $rootScope.user.sname = nameArr[1] + ' ' + nameArr[0];
        $rootScope.user.initials = nameArr[1][0] + nameArr[0][0];
      } else {
        $rootScope.user.initials = '?';
      }
      $state.go('home', {}, {reload: true});
    }
    else {
      $state.go('index');
      if ($('.control-sidebar').length) {
        $('.control-sidebar').removeClass('control-sidebar-open');
      }
    }
  });

  $rootScope.$state = $state;
  // $rootScope.$on('$stateChangeSuccess', function (stateTo, stateToParams, stateFrom, stateFromParams) {
  //   console.log(stateTo, JSON.stringify(stateToParams , null, 2), stateFrom, JSON.stringify(stateFromParams , null, 2));
  // });
  $rootScope.log = function (message) {
    console.log(message);
  };
  $rootScope.json = function (obj) {
    return angular.toJson(obj, 2);
  };

});

})();
