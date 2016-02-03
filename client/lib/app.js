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
      redirect: ($q) => {
        var deferred = $q.defer();

        //if user is logged in redirect to system's home page
        if (Meteor.user()) {
          deferred.reject('go-home');
        }
        else {
          deferred.resolve();
        }

        return deferred.promise;
      }
    }
  });

  $urlRouterProvider.otherwise('/');
})
.controller('MainCtrl', function ($stateParams) {
  console.log('MainCtrl');
  let vm = this;
  Meteor.autorun(function () {
    let user = Meteor.user();
    if (!user) { return; }
    let companyId = $stateParams.companyId;
    let selectedCompany = (companyId)
    ? _.detect(user.companies, (company) => company._id === companyId)
    : { _id: 0, name: '' }

    //list of available company options
    vm.company = {
      selected: selectedCompany,
      options: user.companies || []
    };
    if (! user.companies
      || ! _.any(user.companies, (company) => company.creator))
      {
        vm.company.options.push({
          _id: 1,
          name: 'Открыть свою компанию'
        })
      }
  });

})
.run(function ($state, $rootScope) {
  // console.log('RUN');

  //catch states' auth resolves rejects and redirect accordingly
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    switch (error) {
      case 'go-index':
        $state.go('index');
        break;
      case 'go-home':
        $state.go('home');
        break;
    }
  });

  //when user loggs in or out go to home state
  Meteor.autorun(function () {
    $rootScope.user = Meteor.user();
    console.log('logged in user: ');
    console.log($rootScope.user);
    if ($rootScope.user) {
      if ($rootScope.user.profile
          && /^([А-Я][а-я]+ ){2}([А-Я][а-я]+){1}$/.test($rootScope.user.profile.fname))
      {
        var nameArr = $rootScope.user.profile.fname.split(' ');
        $rootScope.user.sname = nameArr[1] + ' ' + nameArr[0];
        $rootScope.user.initials = nameArr[1][0] + nameArr[0][0];
      }
      else {
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
