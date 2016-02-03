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

  }
});
