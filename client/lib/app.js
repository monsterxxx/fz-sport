(function(){
'use strict';

angular.module('fz', [
  //CORE
  'angular-meteor',
  // 'angular-meteor.auth',
  'ui.router',
  //AUTHORIZATION
  'accounts.ui',
  //navbar
  'fz.navbar-notifications',
  'fz.navbar-tasks',
  //CONTROL SIDEBAR
  'fz.control-sidebar',
  'fz.control-sidebar-profile',
  //ROUTES
  'fz.home',
  'fz.create-company',
  'fz.company',
  'fz.admin',
  'fz.trainer'
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
.controller('MainCtrl', function ($state, $stateParams, $scope) {
  console.log('MainCtrl');
  let vm = this;
  var selectedFromParams;
  vm.company = {
    selected: {_id: 0}
  };

  Meteor.autorun(function () {
    let user = Meteor.user();
    if (!user) { return; }

    //list of available company options
    // console.log('autorun');
    vm.company.options = user.companies || [];
    if (! _.any(user.companies, (company) => company.creator)) {
      vm.company.options.push({
        _id: 1,
        name: 'Открыть свою компанию'
      });
    }
    // console.log(vm.company.selected);
    // console.log(vm.company.options);
  });

  $scope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
    if (! Meteor.user()) { return; }
    // console.log('changeSuccess');
    // console.log(toParams.companyId);
    if (toParams.companyId) {
      if (toParams.companyId !== vm.company.selected._id) {
        vm.company.selected = {_id: toParams.companyId};
        selectedFromParams = true;
      }
    } else if (toState.name === 'create-company'){
      vm.company.selected = {_id: 1};
    } else {
      vm.company.selected = {_id: 0};
    }

    // console.log(vm.company.selected);
  });

  $scope.$watch(() => vm.company.selected, function (newV, oldV) {
    // if (newV._id === 0) {return;}
    // console.log('watch');
    // console.log(newV);
    // console.log(oldV);
    if (newV._id !== oldV._id) {
      // console.log('watch '+ newV._id, oldV._id, selectedFromParams);
      if (selectedFromParams) {
        selectedFromParams = false;
      } else {
        let roles = Roles.getRolesForUser(Meteor.userId(), newV._id);
        let role = (roles.indexOf('owner') !== -1) ? 'owner'
          : (roles.indexOf('admin') !== -1) ? 'admin'
            : (roles.indexOf('trainer') !== -1) ? 'trainer'
              : 'client';
        $state.go('company.'+ role, {companyId: newV._id});
      }
    }
    if (newV._id === 1) {
      $state.go('create-company');
    }
  });

})
.run(function ($state, $rootScope) {
  // console.log('RUN');

  //catch states' auth resolves rejects and redirect according to passed error state object
  $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
    console.log('$stateChangeError > ');
    if (error.name) {
      $state.go(error.name, error.params);
      return;
    }
    console.log('no redirection');
  });

  //when user loggs in or out go to home state
  Meteor.autorun(function () {
    $rootScope.user = Meteor.user();
    console.log('logged in user: ');
    console.log($rootScope.user);
    if ($rootScope.user) {
      if ($rootScope.user.profile.fname)
      {
        var nameArr = $rootScope.user.profile.fname.split(' ');
        $rootScope.user.sname = nameArr[1] + ' ' + nameArr[0];
        $rootScope.user.initials = nameArr[1][0] + nameArr[0][0];
      }
      else {
        $rootScope.user.initials = '?';
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
  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
    console.log('$stateChangeStart > '+ toState.name, toParams, fromState.name, fromParams);
  });
  $rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
    console.log('$stateChangeSuccess > '+ toState.name, toParams, fromState.name, fromParams);
    // console.log('toState > '+ toState.name);
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
