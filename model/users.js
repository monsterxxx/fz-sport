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

  },

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addUserToCompany: function (companyId, userId, role) {
    check(companyId, String);
    check(userId, String);
    check(role, Match.Where(function (role) {
      check(role, String);
      return ['owner', 'admin', 'trainer', 'client'].indexOf(role) !== -1;
    }));

    //AUTH
    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to add users to company.');
    }

    //only owner of the company can add other owners and admins
    if ((role === 'owner' || role === 'admin') && ! Roles.userIsInRole(this.userId, 'owner', companyId)
        //trainers can be added by owners and admins
        || role === 'trainer' && ! Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)
        //clients can be added by owners, admins and trainers
        || role === 'client' && ! Roles.userIsInRole(this.userId, ['owner', 'admin', 'trainer'], companyId)) {
      throw new Meteor.Error('no-permission',
        'Not enough privileges to add '+ role +' to the company.');
    }

    //TODO auth when client is added by trainer - it should be client from his group in this company

    //CHECK USER
    const userToAdd = Users.findOne(userId, { fields: {profile: 1} });

    if (! userToAdd) {
      throw new Meteor.Error('not-found',
        'User to add to company is not found in db.');
    }

    if (Roles.userIsInRole(userId, role, companyId)) {
      throw new Meteor.Error('duplicate',
        'User is '+ role +' of this company already.');
    }

    let roles = Roles.getRolesForUser(userId, companyId);

    //INSERT NEW USER INTO COMPANY
    let modifier = { $push: {} };

    //new user in this company becomes a member
    if (! roles.length) {
      modifier.$push.members = {
        _id: userId,
        name: userToAdd.profile.fname
      };
    }

    //insert member into corresponding role group
    modifier.$push[role + 's'] = {
      _id: userId,
      name: userToAdd.profile.fname
    };

    Companies.update({_id: companyId}, modifier);

    //INSERT COMPANY INTO USER
    //for new members
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

    //GRANT PERMISSION
    Roles.addUsersToRoles(userId, role, companyId);
  },

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  removeUserFromCompany: function (companyId, memberId, role) {
    check(companyId, String);
    check(memberId, String);
    check(role, Match.Where(function (role) {
      check(role, String);
      return ['owner', 'admin', 'trainer', 'client'].indexOf(role) !== -1;
    }));

    //AUTH
    if (! this.userId) { throw new Meteor.Error('not-logged-in'); }

    if (! Roles.userIsInRole(this.userId, ['owner'], companyId)) {
      throw new Meteor.Error('no-permission',
        'Only owner can remove member from company.');
    }

    //CHECK DATA
    //by checking role we also check existance of member and company
    if (! Roles.userIsInRole(memberId, role, companyId)) {
      throw new Meteor.Error('wrong-request',
        'User is not '+ role +' of the company.');
    }

    if (Meteor.isServer) {
      let member = Users.findOne(memberId, { fields: {companies: 1, trainer: 1, client: 1} });

      //CHECK OWNER
      if (role === 'owner' && _.any(member.companies, (company) => company._id === companyId && company.creator)) {
        throw new Meteor.Error('not-allowed',
        'Cannot delete the creator of this company.');
      }

      //FORFEIT PERMISSION
      Roles.removeUsersFromRoles(memberId, role, companyId);
      //get roles to check if member still has some other roles in the company
      let roles = Roles.getRolesForUser(memberId, companyId);

      //REMOVE FROM COMPANY
      let modifier = { $pull: {} };
      modifier.$pull[role+'s'] = { _id: memberId };

      //if user has no other roles in the company, we also delete membership
      if (! roles.length) {
        modifier.$pull.members = {
          _id: memberId
        };
      }

      Companies.update({_id: companyId}, modifier);

      //TRAINER
      //remove all trainer groups in the company
      if (role === 'trainer') {
        member.trainer.groups.forEach(group => {
          if (group.company._id === companyId) {
            Meteor.call('deleteGroup', group._id);
          }
        });
      }

      //CLIENT
      //remove client from all his groups in the company
      if (role === 'client') {
        member.client.groups.forEach(group => {
          if (group.company._id === companyId) {
            Meteor.call('removeMemberFromGroup', group._id, memberId);
          }
        });
      }

      //UPDATE USER
      //if user has no other roles in the company, we delete company from this user
      if (! roles.length) {
        Users.update({_id: memberId}, {
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
