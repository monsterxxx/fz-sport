(function(){
'use strict';

angular.module('fz', [
  //CORE
  'angular-meteor',
  'angular-meteor.auth',
  'ui.router',
  //AUTHORIZATION
  'accounts.ui',
  //navbar
  'fz.navbar-notifications',
  'fz.navbar-tasks',
  //MAIN SIDEBAR
  'fz.company-select',
  //CONTROL SIDEBAR
  'fz.control-sidebar',
  'fz.control-sidebar-profile',
  //ROUTES
  'fz.home',
  'fz.create-company',
  'fz.company'
])

.config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'client/views/index/index.html',
    resolve: {
      auth: ($q) => {
        console.log('auth index');
        var deferred = $q.defer();

        //if user is logged in redirect to system's home page
        if (Meteor.user()) {
          deferred.reject({name: 'home'});
        }
        else {
          deferred.resolve();
        }

        return deferred.promise;
      }
    }
  })
  .state('debug', {
    url: '/debug'
  });

  $urlRouterProvider.otherwise('/');
})

.controller('MainCtrl', function ($state) {
  // console.log('MainCtrl');
})

.run(function ($state, $stateParams, $rootScope) {
  // console.log('RUN');

  //catch states' auth resolves rejects and redirect according to passed error state object
  $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
    console.log('$stateChangeError > '+ JSON.stringify(error , null, 2));
    if (error.name) {
      $state.go(error.name, error.params || {});
      return;
    }
    console.log('no redirection');
  });

  //when user loggs in or out go to home state
  //TODO move USER PANEL logic to separate component
  Meteor.autorun(function () {
    let user = Meteor.user();
    $rootScope.user = user;
    $rootScope.userAuthed = user && user.profile.fname & user.emails[0].verified;
    console.log('logged in user: ');
    console.log(user);
    if (user) {
      if (user.profile.fname)
      {
        var nameArr = user.profile.fname.split(' ');
        user.sname = nameArr[1] + ' ' + nameArr[0];
        user.initials = nameArr[1][0] + nameArr[0][0];
      }
      else {
        user.initials = '?';
      }

      if ($state.current.name === 'index') {
        $state.go('home', {}, {reload: true});
      }
    }
    else {
      $state.go('index');
      if ($('.control-sidebar').length) {
        $('.control-sidebar').removeClass('control-sidebar-open');
      }
    }
  });

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
    console.log('$stateChangeStart > '+ toState.name, toParams, fromState.name, fromParams);
  });
  $rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
    console.log('$stateChangeSuccess > '+ toState.name, toParams, fromState.name, fromParams);
  });

  //DEBUGS
  $rootScope.log = function (message) {
    console.log(message);
  };
  $rootScope.json = function (obj) {
    return angular.toJson(obj, 2);
  };

  // let start = +new Date();
  // let end =  +new Date();
  // console.log('exec time: '+ start, end, start - end);

});

})();
