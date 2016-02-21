Meteor.users.deny({
  update: function() {
    return true;
  }
});

Meteor.methods({
  updateUserProfile: function (userId, profile) {
    check(userId, String);
    check(profile, {
      fname: Match.Where(function (fname) {
        check(fname, String);
        return /^([А-Я][а-я]+ ){2}([А-Я][а-я]+){1}$/.test(fname);
      })
    });

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update user profile.');
    }

    let user = Users.findOne(this.userId);

    if (! (userId === this.userId || user.role.admin)) {
      throw new Meteor.Error('no-permission',
        'Must be the user or admin to update user profile.');
    }

    let modifier = {};

    // if user had task to fill his fname slice this task ( id: 1 )
    if (_.any(user.tasks, (task) => task.id === 1)) {
      modifier.$pull = { tasks: { id: 1 } };
    }

    Users.update({_id: userId},  _.extend( { $set: {profile: profile} }, modifier ) );

    if (Meteor.isServer) {
      let userToUpdate = Users.findOne(userId);

      // console.log(JSON.stringify(userToUpdate , null, 2));

      // TODO update profile in a client doc of the user
      // if (userToUpdate.system.client) {
      //   Clients.update({_id: userToUpdate.system.client._id}, {$set: {profile: profile}});
      // }
    }

  },

  updateUserSettings: function (userId, role) {
    // console.log('updateUserSettings', userId, role);

    check(userId, String);
    check(role, {
      client: Match.Optional(Boolean),
      trainer: Match.Optional(Boolean),
      admin: Match.Optional(Boolean),
      master: Match.Optional(Boolean)
    });

    // console.log('checked!');

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update user role.');
    }

    let user = Users.findOne(this.userId);

    if (! (user.role.admin)) {
      throw new Meteor.Error('no-permission',
        'Must be an admin to update user role.');
    }

    if (Meteor.isServer) {
      let userToUpdate = Users.findOne(userId);

      // console.log(JSON.stringify(userToUpdate , null, 2));

      _.each(role, function (permition, module) {
        if (permition !== userToUpdate.role[module]) {

          if (['admin', 'master'].indexOf(module) >= 0) {
            throw new Meteor.Error('no-permission',
              'Admin cannot change admin or master permissions.');
          }
          // TODO check if user is client
          // if (module === 'client' && userToUpdate.system.client) {
          //   throw new Meteor.Error('invalid-action',
          //     'There are no ex-clients in the App.');
          // }
          if (module === 'trainer'
            && (userToUpdate.trainer && Object.keys(userToUpdate.trainer).length > 0)) {
            throw new Meteor.Error('invalid-action',
              'There are no ex-trainers in the App.');
          }

        }
      });

      Users.update({_id: userId}, {$set: {role: role}});
    }

  },

  addUserToCompany: function (userId, companyId, role) {
    check(userId, String);
    check(companyId, String);
    check(role, Match.Where(function (role) {
      check(role, String);
      return ['owner', 'admin', 'trainer'].indexOf(role) !== -1;
    }));

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to add users to company.');
    }

    if ((role === 'owner' || role === 'admin') && ! Roles.userIsInRole(this.userId, 'owner', companyId)
        || role === 'trainer' && ! Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)) {
      throw new Meteor.Error('no-permission',
        'Not enough privileges to add '+ role +' to the company.');
    }

    let userToAdd = Users.findOne(userId);

    if (! userToAdd) {
      throw new Meteor.Error('not-found',
        'User to add to company is not found in db.');
    }

    if (Roles.userIsInRole(userId, role, companyId)) {
      throw new Meteor.Error('duplicate',
        'User is '+ role +' of this company already.');
    }

    let modifier = { $push: {} };

    let roles = Roles.getRolesForUser(userId, companyId);

    if (! roles.length) {
      modifier.$push.members = { _id: userId };
    }

    modifier.$push[role + 's'] = {
      _id: userId,
      name: userToAdd.profile.fname,
      user: true
    };

    Companies.update({_id: companyId}, modifier);

    Roles.addUsersToRoles(userId, role, companyId);

    if (! roles.length) {

      let company = Companies.findOne(companyId);

      Users.update({_id: userId}, {
        $push: {
          companies: {
            _id: companyId,
            name: company.name
          }
        }
      });
    }

  },

  removeUserFromCompany: function (userId, companyId, role) {
    check(userId, String);
    check(companyId, String);
    check(role, Match.Where(function (role) {
      check(role, String);
      return ['owner', 'admin', 'trainer'].indexOf(role) !== -1;
    }));

    //authorize
    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to remove users from company.');
    }

    if ((role === 'owner' || role === 'admin') && ! Roles.userIsInRole(this.userId, 'owner', companyId)
        || role === 'trainer' && ! Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)) {
      throw new Meteor.Error('no-permission',
        'Not enough privileges to remove '+ role +' to the company.');
    }

    if (Meteor.isServer) {
      //check data
      let userToDelete = Users.findOne(userId);

      if (! userToDelete) {
        throw new Meteor.Error('not-found',
        'User to remove from company is not found in db.');
      }

      let companyInUser = _.detect(userToDelete.companies, (company) => company._id === companyId);

      if (! companyInUser) {
        throw new Meteor.Error('wrong-request',
        'User is not in this company.');
      }

      if (companyInUser.creator) {
        throw new Meteor.Error('not-allowed',
        'Cannot delete the creator of this company.');
      }

      Roles.removeUsersFromRoles(userId, role, companyId);

      let roles = Roles.getRolesForUser(userId, companyId);

      let modifier = { $pull: {} };

      modifier.$pull[role+'s'] = { _id: userId };

      //if user has no other roles in the company, we also delete membership
      if (! roles.length) {
        modifier.$pull.members = {
          _id: userId
        };
      }

      Companies.update({_id: companyId}, modifier);

      //if user has no other roles in the company, we delete company from this user
      if (! roles.length) {
        Users.update({_id: userId}, {
          $pull: {
            companies: {
              _id: companyId
            }
          }
        });
      }

    }
  }
});
