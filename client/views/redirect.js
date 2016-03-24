(function() {
'use strict';

angular
.module('fz.redirect', [])

.config(function ($stateProvider) {
  $stateProvider
  .state('redirect', {
    url: '/redirect',
    resolve: {
      redirect: ($q) => {
        const deferred = $q.defer(),
              user = Users.findOne(Meteor.userId(), { fields: {profile: 1, emails: 1, roles: 1} }),
              singleCompanyState = (user) ? getSingleCompanyState(user.roles) : null;

        resolve();
        return deferred.promise;

        function resolve() {
          //if user is not registered go to login page
          console.log(Meteor.userId());
          console.log(Users.findOne(Meteor.userId(), { fields: {profile: 1, emails: 1, roles: 1} }));
          console.log(user);
          if (! Meteor.userId()) {
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
});

})();
