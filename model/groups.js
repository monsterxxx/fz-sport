Meteor.methods({
  createGroup: function (group) {
    check(group, {
      company: Match.ObjectIncluding({
        _id: String
      }),
      trainer: Match.ObjectIncluding({
        _id: String
      }),
      name: String
    });

    const companyId = group.company._id;
    const trainerId = group.trainer._id;

    //AUTH
    if (! this.userId) { throw new Meteor.Error('not-logged-in'); }

    if (! Roles.userIsInRole(this.userId, ['owner', 'admin', 'trainer'], companyId)) {
      throw new Meteor.Error('no-permission',
        'Only owners, admins or trainers can create new group.');
    }

    //if its just a trainer who creates the group, then it should be strictly his group
    if (! Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)
        && Roles.userIsInRole(this.userId, 'trainer', companyId)
        && trainerId !== this.userId) {
      throw new Meteor.Error('no-permission',
        'Trainers in the company can create only their own groups.');
    }

    //CHECK
    const company = Companies.findOne(companyId, { fields: {name: 1} });
    const trainer = Users.findOne(trainerId, { fields: {profile: 1} });

    if (! trainer) {
      throw new Meteor.Error('not-found',
        'No user record for this trainer in db.');
    }

    //PREPARE DATA
    group.createdAt = new Date();
    group.company.name = company.name;
    group.trainer.name = trainer.profile.fname;

    //CREATE GROUP
    const groupId = Groups.insert(group);

    //INSERT GROUP INTO COMPANY
    Companies.update({_id: companyId}, {
      $push: {
        groups: {
          _id: groupId,
          name: group.name,
          trainer: group.trainer
        }
      }
    });

    //INSERT GROUP INTO TRAINER USER
    Users.update({_id: trainerId}, {
      $push: {
        'trainer.groups': {
          _id: groupId,
          name: group.name,
          company: { _id: companyId }
        }
      }
    });

    return true;
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  deleteGroup: function (groupId) {
    check(groupId, String);

    //CHECK GROUP EXISTANCE
    const group = Groups.findOne(groupId, {fields: {company: 1, trainer: 1, clients: 1}});

    if (! group) {
      throw new Meteor.Error('not-found',
        'No such group in db.');
    }

    const companyId = group.company._id;
    const trainerId = group.trainer._id;

    //AUTH
    if (! Roles.userIsInRole(this.userId, 'owner', companyId)) {
      throw new Meteor.Error('no-permission',
        'Only owner can delete groups.');
    }

    //REMOVE CLIENTS FROM GROUP
    if (group.clients)
      group.clients.forEach(client => Meteor.call('removeMemberFromGroup', groupId, client._id));

    //DELETE GROUP
    Groups.remove({_id: groupId});

    //REMOVE GROUP FROM COMPANY
    Companies.update({_id: companyId}, {
      $pull: {
        groups: {
          _id: groupId
        }
      }
    });

    //REMOVE GROUP FROM TRAINER
    Users.update({_id: trainerId}, {
      $pull: {
        'trainer.groups': {
          _id: groupId
        }
      }
    });
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addMemberToGroup: function (groupId, memberId, surrogate) {
    //SURROGATE ENABLED
    //this is createSurrogate enabled method, which inserts surrogate user into Users collection
    //  when following parameters are specified: memberId === '0', surrogate: surrogateUserProfile
    check(groupId, String);
    check(memberId, String);
    check(surrogate, Match.Optional({
      fname: Match.Where(function (fname) {
        check(fname, String);
        return /^([А-Я][а-я]+ ){1,2}([А-Я][а-я]+){1}$/.test(fname);
      })
    }));

    //AUTH
    if (! this.userId) { throw new Meteor.Error('not-logged-in'); }

    //CHECK GROUP
    const group = Groups.findOne(groupId, {fields: {name: 1, company: 1, trainer: 1, clients: 1}});

    if (! group) {
      throw new Meteor.Error('not-found',
        'No such group in db.');
    }

    if (_.any(group.clients, (client) => client._id === memberId)) {
      throw new Meteor.Error('duplicate',
        'This member is in the group already.');
    }

    const companyId = group.company._id;

    //AUTH
    if (! Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)
        && group.trainer._id !== this.userId) {
      throw new Meteor.Error('no-permission',
        'Only owners, admins or trainer of this group can add members to it.');
    }

    if (group.trainer._id === memberId) {
      throw new Meteor.Error('wrong-request',
        'Trainer cannot be a student of the group.');
    }

    //CREATING SURROGATE AND PREPARING DATA
    let member;

    if (memberId === '0') {
      if (Meteor.isServer) {
        memberId = createSurrogate(surrogate);
        member = {
          _id: memberId,
          name: surrogate.fname
        };
      }
      if (Meteor.isClient) {
        //surrogate creation way is not for browser
        return;
      }
    }
    if (memberId !== '0') {
      const userToAdd = Users.findOne(memberId, {fields: {profile: 1}});
      if (! userToAdd) {
        throw new Meteor.Error('not-found',
          'No such member in db.');
      }
      member = {
        _id: memberId,
        name: userToAdd.profile.fname
      };
    }

    //INSERT MEMBER INTO GROUP
    Groups.update({_id: groupId}, {
      $push: {
        clients: member
      }
    });

    //INSERT MEMBER AS CLIENT INTO COMPANY
    //if this is a first group for this member
    if (! Roles.userIsInRole(memberId, 'client', companyId)) {
      Meteor.call('addUserToCompany', companyId, memberId, 'client');
    }

    //INSERT GROUP INTO USER
    Users.update({_id: memberId}, {
      $push: {
        'client.groups': {
          _id: groupId,
          name: group.name,
          company: { _id: companyId }
        }
      }
    });

  },

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  removeMemberFromGroup: function (groupId, memberId) {
    check(groupId, String);
    check(memberId, String);

    //AUTH
    if (! this.userId) { throw new Meteor.Error('not-logged-in'); }

    //CHECK GROUP
    const group = Groups.findOne(groupId, { fields: {company: 1, clients: 1}});

    if (! group) {
      throw new Meteor.Error('not-found',
        'No such group in db.');
    }

    if (! _.any(group.clients, client => client._id === memberId)) {
      throw new Meteor.Error('wrong-request',
        'No such member in the group.');
    }

    const companyId = group.company._id;

    //AUTH
    if (! Roles.userIsInRole(this.userId, 'owner', companyId)) {
      throw new Meteor.Error('no-permission',
      'Only owner can remove member from group.');
    }

    //REMOVE MEMBER FROM GROUP
    Groups.update({_id: groupId}, {
      $pull: {
        clients: {
          _id: memberId
        }
      }
    });

    //REMOVE GROUP FROM MEMBER
    Users.update({_id: memberId}, {
      $pull: {
        'client.groups': {
          _id: groupId
        }
      }
    });

    //REMOVE CLIENT FROM COMPANY
    //if this method was not triggered by removeMemeberFromComapny
    if (Roles.userIsInRole(memberId, 'client', companyId)) {
      //and if this member does not participate in other groups of this company
      const member = Users.findOne(memberId, { fields: {client: 1}});
      if (
        ! _.any( member.client.groups, (group) => group.company._id === companyId )
      ) {
        Meteor.call('removeUserFromCompany', companyId, memberId, 'client');
      }
    }
  }

});
