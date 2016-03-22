(function(){
'use strict';

angular.module('fz', [
  //CORE
  'angular-meteor',
  'angular-meteor.auth',
  'ui.router',
  //ANGULAR PLUGINS
  'ngFitText',
  //AUTHORIZATION
  'accounts.ui',
  //ROUTES
  'fz.home',
  'fz.sys'
])

.config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
  .state('index', {
    url: '/',
    resolve: {
      auth: ($q) => {
        const deferred = $q.defer(),
              user = Users.findOne(Meteor.userId(), { fields: {profile: 1, emails: 1, roles: 1} }),
              singleCompanyState = (user) ? getSingleCompanyState(user.roles) : null;

        resolve();
        return deferred.promise;

        function resolve() {
          //if user is not registered go to login page
          if (! user) {
            deferred.reject({name: 'home.login'});
          } else
          //if user hasn't finished registration process yet
          if (! user.profile.fname || ! user.emails[0].verified) {
            deferred.reject({name: 'home.finish-registration'});
          } else
          //if user has only one company, choose this company automatically
          if (singleCompanyState) {
            deferred.reject(singleCompanyState);
          }
          //otherwise go to select company page
          else {
            deferred.reject({name: 'sys.select-company'});
          }
        }

        function getSingleCompanyState(roles) {
          const companyIds = (roles) ? Object.keys(roles) : null;
          if (! companyIds || companyIds.length !== 1) return;
          const companyId = companyIds[0];
          //find and return state name for the highest available role
          return {
            name: 'sys.company.' + Roles.getTopRole(user, companyId),
            params: {companyId: companyId}
          };
        }

      }
    }
  });
  //state for any debug purposes
  // .state('debug', {
  //   url: '/debug'
  // });

  $urlRouterProvider.otherwise('/');
})

.config(function(fitTextConfigProvider) {
  fitTextConfigProvider.config = {
    debounce: function(a,b,c) {         // specify your own function
      var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}
    },
    delay: 20,                        // debounce delay
    loadDelay: 10,                      // global default delay before initial calculation
    compressor: 1                      // global default calculation multiplier
  };
})

.run(function ($state, $stateParams, $rootScope) {
  // console.log('RUN');

  //catch states' auth resolves rejects and redirect according to passed error state object
  $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
    console.log('$stateChangeError > '+ JSON.stringify(error , null, 2));
    if (error.name) return $state.go(error.name, error.params || {});
  });

  //when user loggs in or out go to home state
  //TODO move USER PANEL logic to separate component
  Meteor.autorun(function () {
    let user = Meteor.user();
    $rootScope.user = user;
    $rootScope.userAuthed = user && user.profile.fname && user.emails[0].verified;
    console.log('logged in user: ');
    console.log(user);
    if (user) {
      if (user.profile.fname) {
        var nameArr = user.profile.fname.split(' ');
        user.sname = nameArr[1] + ' ' + nameArr[0];
        user.initials = nameArr[1][0] + nameArr[0][0];
      } else {
        user.initials = '?';
      }
      if ($state.current.name === 'home.login') {
        $state.go('index');
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
