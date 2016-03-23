(function() {
'use strict';

angular
.module('fz.sys', [
  //COMPONENTS
    //navbar
    'fz.navbar-notifications',
    'fz.navbar-tasks',
    //main sidebar
    'fz.company-select',
    //control sidebar
    'fz.control-sidebar',
    'fz.control-sidebar-profile',
  //ROUTES
  'fz.select-company',
  'fz.create-company',
  'fz.company'
])

.config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
  $stateProvider
  .state('sys', {
    url: '/sys',
    templateUrl: 'client/views/sys/sys.html',
    abstract: true,
    resolve: {
      auth: ($q) => {
        console.log('auth sys');
        const deferred = $q.defer(),
              user = Users.findOne(Meteor.userId(), { fields: {profile: 1, emails: 1} });

        resolve();
        return deferred.promise;

        function resolve() {
          //if user is not logged in redirect to index page
          if (! user || ! user.profile.fname || ! user.emails[0].verified) {
            deferred.reject({name: 'index'});
          }
          else {
            deferred.resolve();
          }
        }

      }
    },
    controller: Ctrl
  });
});

//controller here just to make adminLTE work properly with angular
Ctrl.$inject = ['$timeout'];

function Ctrl($timeout) {
  $timeout(function(){
    if (! $('.control-sidebar').hasClass('activated')) {
      $.AdminLTE.controlSidebar.activate();
      $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
    }
  });
}

})();
