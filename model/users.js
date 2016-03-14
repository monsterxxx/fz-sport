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

    if (! this.userId) { throw new Meteor.Error('not-logged-in'); }

    let user = Users.findOne(this.userId);

    if (userId !== this.userId) {
      throw new Meteor.Error('no-permission',
        'Only user can update his profile.');
    }

    let modifier = {};

    // if user had task to fill his fname slice this task ( id: 1 )
    if (_.any(user.tasks, (task) => task.id === 1)) {
      modifier.$pull = { tasks: { id: 1 } };
    }

    Users.update({_id: userId},  _.extend( { $set: {profile: profile} }, modifier ) );

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
    if (! this.userId) { throw new Meteor.Error('not-logged-in'); }

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

    if (Meteor.isServer) {
      //CHECK USER
      const member = Users.findOne(userId, { fields: {profile: 1, surrogate: 1} });

      if (! member) {
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
          $each: [{
            _id: userId,
            name: member.profile.fname
          }],
          $sort: {name: 1}
        };
        if (member.surrogate) modifier.$push.members.surrogate = true;
      }

      //insert member into corresponding role group
      modifier.$push[role + 's'] = {
        $each: [{
          _id: userId,
          name: member.profile.fname
        }],
        $sort: {name: 1}
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
    }
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
    if (! Roles.userIsInRole(this.userId, 'owner', companyId)) {
      throw new Meteor.Error('no-permission',
        'Only owner can remove member from company.');
    }

    if (Meteor.isServer) {
      //CHECK DATA
      //by checking role we also check existance of member and company
      if (! Roles.userIsInRole(memberId, role, companyId)) {
        throw new Meteor.Error('wrong-request',
        'User is not '+ role +' of the company.');
      }

      const member = Users.findOne(memberId, { fields: {companies: 1, trainer: 1, client: 1, surrogate:1} });

      //CHECK OWNER
      if (role === 'owner' && _.any(member.companies, (company) => company._id === companyId && company.creator)) {
        throw new Meteor.Error('not-allowed',
        'Cannot delete the creator of this company.');
      }

      //FORFEIT PERMISSION
      Roles.removeUsersFromRoles(memberId, role, companyId);
      //get roles to check if member still has some other roles in the company
      const roles = Roles.getRolesForUser(memberId, companyId);

      //TRAINER
      //remove all trainer groups in the company
      if (role === 'trainer' && member.trainer.groups) {
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

      //REMOVE COMPANY FROM MEMBER
      //if user has no other roles in the company
      if (! roles.length) {
        //and is a surrogate user, delete him completely
        if (member.surrogate)
          Users.remove({_id: memberId});
        //otherwise remove the company from his companies
        else
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
