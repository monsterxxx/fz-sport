(function() {
'use strict';

angular
.module('fz.finish-registration', [])

.config(function ($stateProvider) {
  $stateProvider
  .state('home.finish-registration', {
    url: '/finish-registration/:token',
    params: {
        token: {value: null, squash: true}
    },
    templateUrl: 'client/views/home/finish-registration/finish-registration.html',
    resolve: {
      auth: ($q) => {
        console.log('auth login');
        const deferred = $q.defer(),
              user = Users.findOne(Meteor.userId(), { fields: {profile: 1, emails: 1} });

        resolve();
        return deferred.promise;

        function resolve() {
          if (! user || (user.profile.fname && user.emails[0].verified)) {
            deferred.reject({name: 'index'});
          }
          else {
            deferred.resolve();
          }
        }

      }
    },
    controller: Ctrl,
    controllerAs: 'vm'
  });
});

Ctrl.$inject = ['$scope', '$reactive', '$stateParams', '$state'];

function Ctrl($scope, $reactive, $stateParams, $state) {
  const vm = this,
        token = $stateParams.token;
  $reactive(vm).attach($scope);
  let oriProfile;
  vm.helpers({ user: userHelper });
  $scope.$watch(() => vm.user, userListner(), true);
  vm.updateUserProfile = () => Meteor.call('updateUserProfile', Meteor.userId(), vm.user.profile);
  vm.sendVerificationLink = sendVerificationLink;
  console.log(token);
  if (token) Accounts.verifyEmail(token);

  function userHelper() {
    const user = Meteor.user();
    if (user) {
      if (user.profile.fname && user.emails[0].verified) return $state.go('index');
      oriProfile = angular.copy(user.profile);
    }
    vm.profileChanged = false;
    return user;
  }

  function userListner(user) {
    if (user) vm.profileChanged = ! angular.equals(user.profile, oriProfile)};

  function sendVerificationLink() {
    vm.emailSending = true;
    Meteor.call('sendVerificationLink', () => {
      $scope.$apply(() => vm.emailSending = false);
    });
  }
}

})();
