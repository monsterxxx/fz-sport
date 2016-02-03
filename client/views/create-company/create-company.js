(function() {
'use strict';

angular
  .module('fz.create-company', [

  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('create-company', {
        url: '/create-company',
        templateUrl: 'client/views/create-company/create-company.html',
        resolve: {
          auth: ($q) => {
            var deferred = $q.defer();

            if (!Meteor.user()) {
              deferred.reject('go-index');
              return deferred.promise;
            }
            //if user has already created a company, go to home page
            if (_.any(Meteor.user().companies, (company) => company.creator)) {
              deferred.reject('go-home');
            }
            else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        },
        controller: Ctrl,
        controllerAs: 'vm'
      });
  });

function Ctrl() {
  let vm = this;
  vm.word = 'hello!';
}

})();
